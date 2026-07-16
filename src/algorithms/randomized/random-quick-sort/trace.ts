// =============================================================================
// 随机化快速排序 · 录制帧序列
// 通过 randomQuickSort 的钩子录成 Frame[]。使用固定种子保证可复现。
// 角色语义同 quick-sort：pivot='pivot'，compare='compare'，swap='swap'，就位='final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomQuickSort, makeLcg, type RandomQuickSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];
/** 固定种子：演示与单测都可据此断言同一输出。 */
export const DEFAULT_SEED = 42;

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, seed: number = DEFAULT_SEED): Frame[] {
  const rec = new TraceRecorder();
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

  snapshot({
    zh: `初始数组：${a.join(', ')}（种子 ${seed}）`,
    en: `Initial array: ${a.join(', ')} (seed ${seed})`,
  });

  const hooks: RandomQuickSortHooks = {
    onPickPivot: (picked, hi) => {
      pivotIdx = hi;
      snapshot({
        zh: `随机选中下标 ${picked}，交换到区间末尾 ${hi} 作为基准`,
        en: `Randomly picked index ${picked}, swapped to end ${hi} as pivot`,
      });
    },
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

  randomQuickSort(input, makeLcg(seed), hooks);

  // 终态
  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
