// =============================================================================
// 选择排序 · 录制帧序列
// 通过 selectionSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { selectionSort, type SelectionSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  const pinned = new Set<number>(); // 左侧已就位段
  let minIdx = -1; // 当前候选最小值下标
  const comparing = new Set<number>();

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const p of pinned) roles[p] = 'final';
    if (minIdx >= 0 && !pinned.has(minIdx)) roles[minIdx] = 'pivot';
    for (const c of comparing) if (!roles[c]) roles[c] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    comparing.clear();
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: SelectionSortHooks = {
    onRound: (round) => {
      snapshot({
        zh: `第 ${round + 1} 轮：从下标 ${round} 起找最小值`,
        en: `Round ${round + 1}: find min starting from index ${round}`,
      });
    },
    onMin: (idx) => {
      minIdx = idx;
      snapshot({
        zh: `候选最小值：下标 ${idx}（值 ${a[idx]}）`,
        en: `Candidate min: index ${idx} (value ${a[idx]})`,
      });
    },
    onCompare: (i) => {
      comparing.add(i);
    },
    onSwap: (lo, mi) => {
      const t = a[lo]!;
      a[lo] = a[mi]!;
      a[mi] = t;
      minIdx = -1;
      snapshot({
        zh: `交换下标 ${lo} 和 ${mi}，把最小值放到 ${lo}`,
        en: `Swap indices ${lo} ↔ ${mi}; min now at ${lo}`,
      });
    },
    onPinned: (lo) => {
      pinned.add(lo);
      minIdx = -1;
      snapshot({
        zh: `下标 ${lo}（值 ${a[lo]}）已就位`,
        en: `Index ${lo} (value ${a[lo]}) is in its final place`,
      });
    },
  };

  selectionSort(input, hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
