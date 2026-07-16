// =============================================================================
// 快速排序 · 录制帧序列
// 通过 quickSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quickSort, type QuickSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 用一份可变的「当前数组 + 角色快照」，在钩子里维护
  const a = [...input];
  let pivotIdx = -1;
  const pinned = new Set<number>();
  const comparing = new Set<number>();
  let pendingSwap: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const p of pinned) roles[p] = 'final';
    if (pivotIdx >= 0 && !pinned.has(pivotIdx)) roles[pivotIdx] = 'pivot';
    if (pendingSwap) {
      roles[pendingSwap[0]] = 'swap';
      roles[pendingSwap[1]] = 'swap';
    }
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
    pendingSwap = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: QuickSortHooks = {
    onPartition: (lo, hi, p) => {
      pivotIdx = p;
      snapshot({
        zh: `划分 [${lo}, ${hi}]，基准 = ${a[p]}（下标 ${p}）`,
        en: `Partition [${lo}, ${hi}], pivot = ${a[p]} (idx ${p})`,
      });
    },
    onCompare: (i) => {
      comparing.add(i);
    },
    onSwap: (i, j) => {
      const tmp = a[i]!;
      a[i] = a[j]!;
      a[j] = tmp;
      pendingSwap = [i, j];
      snapshot({
        zh: `交换下标 ${i} 和 ${j}`,
        en: `Swap indices ${i} ↔ ${j}`,
      });
    },
    onPinned: (i) => {
      pinned.add(i);
      pivotIdx = -1;
      snapshot({
        zh: `下标 ${i}（值 ${a[i]}）已就位`,
        en: `Index ${i} (value ${a[i]}) is in its final place`,
      });
    },
  };

  quickSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
