// =============================================================================
// 堆选择 · 录制帧序列
// 通过 heapselect 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heapselect, type HeapselectHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [7, 2, 9, 4, 1, 8, 5, 3, 6, 0], k: 4 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const inHeap = new Set<number>(); // 当前在堆中的元素下标
  const popped = new Set<number>(); // 被弹出的下标
  let doneIdx = -1;
  let doneVal = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const i of popped) roles[i] = 'warn';
    for (const i of inHeap) roles[i] = 'pivot';
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles))
      .setAux([
        {
          label: '堆（容量 ' + k + '）',
          value: arr
            .filter((_, i) => inHeap.has(i))
            .sort((a, b) => a - b)
            .join(', '),
          role: 'pivot' as BarRole,
        },
        {
          label: '已淘汰',
          value: arr.filter((_, i) => popped.has(i)).join(', ') || '—',
          role: 'warn' as BarRole,
        },
      ])
      .commit();
  };

  snapshot({
    zh: `初始数组，目标：第 ${k} 小（1-based）`,
    en: `Initial array, target: ${k}-th smallest (1-based)`,
  });

  const hooks: HeapselectHooks = {
    onPush: (idx) => {
      inHeap.add(idx);
      snapshot({
        zh: `入堆：下标 ${idx}（值 ${arr[idx]}）`,
        en: `Push idx ${idx} (value ${arr[idx]})`,
      });
    },
    onPop: (ejectedIdx) => {
      popped.add(ejectedIdx);
      inHeap.delete(ejectedIdx);
    },
    onDone: (rk, value) => {
      const idx = arr.indexOf(value);
      doneIdx = idx;
      doneVal = value;
      snapshot({
        zh: `完成：第 ${rk} 小 = ${value}`,
        en: `Done: ${rk}-th smallest = ${value}`,
      });
    },
  };

  heapselect(arr, k, hooks);

  // 终态：堆中保留的 k 个元素标 final，命中元素特别高亮
  const roles: Record<number, BarRole> = {};
  for (let i = 0; i < arr.length; i++) {
    if (i === doneIdx) roles[i] = 'final';
    else if (inHeap.has(i)) roles[i] = 'sorted';
    else roles[i] = 'default';
  }
  rec
    .begin({ zh: `第 ${k} 小 = ${doneVal}`, en: `${k}-th smallest = ${doneVal}` })
    .setBars(rec.barsFrom(arr, roles))
    .setAux([{ label: '结果', value: `第 ${k} 小 = ${doneVal}`, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
