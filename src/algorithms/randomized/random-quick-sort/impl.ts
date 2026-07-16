// =============================================================================
// 随机化快速排序（Randomized Quicksort）· 纯算法实现
// 在 Lomuto 分区前，先从 [lo,hi] 中随机选一个下标与 hi 交换，使 pivot 随机化，
// 从而避免「已有序输入 → 最坏 O(n^2)」的退化。固定种子 rng 保证可复现。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步操作供录制器使用。
// =============================================================================

/** 产生 [0, n) 区间整数的确定性伪随机函数类型。 */
export type Rng = (n: number) => number;

/**
 * 线性同余生成器（LCG），可复现的随机源。
 * 同一种子产生同一序列，便于 buildTrace 与单测断言。
 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (n: number): number => {
    // Numerical Recipes 常量
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % n;
  };
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RandomQuickSortHooks {
  /** 进入某段 [lo, hi] 的划分。pivotIdx 为随机选中并交换到 hi 的下标。 */
  onPartition?: (lo: number, hi: number, pivotIdx: number) => void;
  /** 随机选中下标 picked，将其值交换到区间末尾 hi。 */
  onPickPivot?: (picked: number, hi: number) => void;
  /** 比较下标 i 与 pivot 值。 */
  onCompare?: (i: number, pivotIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 下标 i 已就位（最终位置）。 */
  onPinned?: (i: number) => void;
}

/**
 * 随机化快速排序（Lomuto 分区，原地、不稳定）。
 *
 * 与确定性快排的唯一区别：每次分区前，从 `[lo, hi]` 均匀随机选一个下标 `r`，
 * 把 `a[r]` 与 `a[hi]` 交换，使 pivot 随机化。这样无论输入分布如何，
 * 期望时间复杂度均为 `O(n log n)`，最坏情况（每次选到极值）虽仍为 `O(n^2)`，
 * 但其发生概率随 n 指数下降，实际不可见。
 *
 * @param arr 待排序数组（克隆后操作，不修改原数组）
 * @param rng 随机源；默认用 Math.random（不可复现）。建议传 makeLcg(seed)
 * @param hooks 可选事件钩子
 * @returns 排序后的新数组
 */
export function randomQuickSort(
  arr: readonly number[],
  rng: Rng = (n) => Math.floor(Math.random() * n),
  hooks: RandomQuickSortHooks = {},
): number[] {
  const a = [...arr];
  const pinned = new Set<number>();

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const partition = (lo: number, hi: number): number => {
    // 随机选 pivot：从 [lo, hi] 选 r，交换到 hi
    const r = lo + rng(hi - lo + 1);
    if (r !== hi) {
      swap(r, hi);
      hooks.onSwap?.(r, hi);
    }
    hooks.onPickPivot?.(r, hi);

    const pivot = a[hi]!;
    let i = lo - 1; // i 指向「小于 pivot 区」末尾
    hooks.onPartition?.(lo, hi, hi);
    for (let j = lo; j < hi; j++) {
      hooks.onCompare?.(j, hi);
      if (a[j]! < pivot) {
        i++;
        if (i !== j) {
          swap(i, j);
          hooks.onSwap?.(i, j);
        }
      }
    }
    // 把基准放到正确位置
    if (i + 1 !== hi) {
      swap(i + 1, hi);
      hooks.onSwap?.(i + 1, hi);
    }
    pinned.add(i + 1);
    hooks.onPinned?.(i + 1);
    return i + 1;
  };

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) {
      if (lo === hi) {
        pinned.add(lo);
        hooks.onPinned?.(lo);
      }
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  };

  sort(0, a.length - 1);
  for (let k = 0; k < a.length; k++) pinned.add(k);
  return a;
}
