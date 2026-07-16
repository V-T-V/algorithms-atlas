// =============================================================================
// 插入排序 · 录制帧序列
// 通过 insertionSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { insertionSort, type InsertionSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let boundary = -1; // 左侧 [0, boundary] 为已排序段
  let picked = -1; // 当前待插入元素下标
  const comparing = new Set<number>();
  let pendingShift: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let k = 0; k <= boundary; k++) roles[k] = 'sorted';
    if (picked >= 0 && !roles[picked]) roles[picked] = 'pivot';
    if (pendingShift) {
      roles[pendingShift[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingShift = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: InsertionSortHooks = {
    onPick: (i) => {
      picked = i;
      snapshot({
        zh: `取出下标 ${i}（值 ${a[i]}），准备插入左侧有序段`,
        en: `Pick index ${i} (value ${a[i]}) to insert into the sorted prefix`,
      });
    },
    onCompare: (j) => {
      comparing.add(j);
    },
    onShift: (j, jNext) => {
      a[jNext] = a[j]!;
      pendingShift = [j, jNext];
      snapshot({
        zh: `a[${j}]=${a[jNext]} > key，右移到 ${jNext}`,
        en: `a[${j}]=${a[jNext]} > key, shift right to ${jNext}`,
      });
    },
    onPlace: (i, value) => {
      a[i] = value;
      picked = -1;
      boundary = i; // 有序段扩展到本轮落点
      snapshot({
        zh: `写入落点 ${i}（值 ${value}），有序段扩展`,
        en: `Place value ${value} at ${i}; sorted prefix grows`,
      });
    },
  };

  insertionSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
