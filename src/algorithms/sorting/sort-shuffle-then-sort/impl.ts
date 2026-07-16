// =============================================================================
// 洗牌防御排序 · 纯算法实现
// Fisher-Yates 洗牌 + 三数取中快排（Lomuto 分区），消除最坏情况。
// =============================================================================
export interface ShuffleThenSortHooks {
  onShuffleStart?: () => void;
  onShuffleSwap?: (i: number, j: number, arr: number[]) => void;
  onShuffleEnd?: (arr: number[]) => void;
  onPartition?: (lo: number, hi: number, pivotIdx: number) => void;
  onSwap?: (i: number, j: number, arr: number[]) => void;
}

/** 可注入的随机数发生器（默认 Math.random），便于测试可复现。 */
function shuffle(a: number[], hooks: ShuffleThenSortHooks, rng: () => number): void {
  hooks.onShuffleStart?.();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
    hooks.onShuffleSwap?.(i, j, a);
  }
  hooks.onShuffleEnd?.(a);
}

function medianOfThree(a: number[], lo: number, hi: number): number {
  const mid = (lo + hi) >> 1;
  const x = a[lo]!,
    y = a[mid]!,
    z = a[hi]!;
  if ((x <= y && y <= z) || (z <= y && y <= x)) return mid;
  if ((y <= x && x <= z) || (z <= x && x <= y)) return lo;
  return hi;
}

function quicksort(a: number[], lo: number, hi: number, hooks: ShuffleThenSortHooks): void {
  if (lo >= hi) return;
  const pIdx = medianOfThree(a, lo, hi);
  [a[pIdx], a[hi]] = [a[hi]!, a[pIdx]!];
  const pivot = a[hi]!;
  hooks.onPartition?.(lo, hi, hi);
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j]! <= pivot) {
      [a[i], a[j]] = [a[j]!, a[i]!];
      hooks.onSwap?.(i, j, a);
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi]!, a[i]!];
  hooks.onSwap?.(i, hi, a);
  quicksort(a, lo, i - 1, hooks);
  quicksort(a, i + 1, hi, hooks);
}

/**
 * 洗牌防御排序。
 * @param arr 待排序数组（克隆后操作）
 * @param rng 可注入随机源，默认 Math.random
 * @param hooks 可选的事件钩子
 */
export function shuffleThenSort(
  arr: readonly number[],
  rng: () => number = Math.random,
  hooks: ShuffleThenSortHooks = {},
): number[] {
  const a = [...arr];
  if (a.length <= 1) return a;
  shuffle(a, hooks, rng);
  quicksort(a, 0, a.length - 1, hooks);
  return a;
}
