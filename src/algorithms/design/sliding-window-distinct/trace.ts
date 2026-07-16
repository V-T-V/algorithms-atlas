// =============================================================================
// 滑动窗口去重计数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slidingWindowDistinct, type SWDistinctHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 2, 1, 3, 2, 4, 1], k: 4 };

interface TraceOptions {
  arr: number[];
  k: number;
}

export function buildTrace(input: TraceOptions = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const n = arr.length;
  let freq = new Map<number, number>();
  let winEnd = k - 2;
  const recorded: Array<{ end: number; distinct: number }> = [];
  let curDistinct = 0;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map((_, i) => {
      const inWin = i <= winEnd && i >= winEnd - k + 1;
      return inWin ? 'default' : 'sorted';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (winEnd >= k - 1 && winEnd < n) {
      pointers.push({ index: winEnd - k + 1, label: 'L' });
      pointers.push({ index: winEnd, label: 'R' });
    }
    rec
      .begin(note)
      .setArray([...arr], roles, pointers)
      .setAux([
        { label: '窗口 k', value: String(k), role: 'pivot' as BarRole },
        {
          label: '频次表',
          value: Array.from(freq.entries())
            .map(([v, c]) => `${v}:${c}`)
            .join(', '),
          role: 'compare' as BarRole,
        },
        {
          label: '不同元素数',
          value: String(curDistinct),
          role: 'final' as BarRole,
        },
        {
          label: '已记录',
          value: `[${recorded.map((r) => r.distinct).join(', ')}]`,
          role: 'sorted' as BarRole,
        },
      ])
      .commit();
  };

  render({
    zh: `大小 ${k} 的窗口在 [${arr.join(',')}] 上滑动`,
    en: `Window of size ${k} sliding over [${arr.join(',')}]`,
  });

  const hooks: SWDistinctHooks = {
    onAdd: (i, _v, d, f) => {
      freq = f;
      curDistinct = d;
      winEnd = i;
      render({
        zh: `入窗 a[${i}]=${arr[i]}，不同元素=${d}`,
        en: `Add a[${i}]=${arr[i]}, distinct=${d}`,
      });
    },
    onRemove: (j, u, d, f) => {
      freq = f;
      curDistinct = d;
      render({ zh: `出窗 a[${j}]=${u}，不同元素=${d}`, en: `Remove a[${j}]=${u}, distinct=${d}` });
    },
    onWindow: (i, d, _f) => {
      recorded.push({ end: i, distinct: d });
      curDistinct = d;
      render({
        zh: `窗口 [${i - k + 1},${i}] 不同元素 = ${d}`,
        en: `Window [${i - k + 1},${i}] distinct = ${d}`,
      });
    },
  };

  slidingWindowDistinct(arr, k, hooks);

  rec
    .begin({
      zh: `完成：去重计数序列 [${recorded.map((r) => r.distinct).join(', ')}]`,
      en: `Done: distinct counts = [${recorded.map((r) => r.distinct).join(', ')}]`,
    })
    .setArray(
      [...arr],
      arr.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([
      {
        label: '结果',
        value: `[${recorded.map((r) => r.distinct).join(', ')}]`,
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
