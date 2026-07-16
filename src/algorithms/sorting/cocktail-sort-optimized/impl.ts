// =============================================================================
// 优化鸡尾酒排序（Optimized Cocktail Shaker Sort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CocktailOptHooks {
  /** 正向扫描开始，未排序段 [lo, hi]。 */
  onForwardStart?: (lo: number, hi: number) => void;
  /** 反向扫描开始，未排序段 [lo, hi]。 */
  onBackwardStart?: (lo: number, hi: number) => void;
  /** 比较相邻下标 i、j。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 右界跳跃到 newHi（最后交换位置优化）。 */
  onJumpHi?: (newHi: number) => void;
  /** 左界跳跃到 newLo。 */
  onJumpLo?: (newLo: number) => void;
  /** 下标 i 已就位。 */
  onSorted?: (i: number) => void;
}

/**
 * 优化鸡尾酒排序：双向冒泡 + 最后交换位置跳跃。
 *
 * 正向扫到 hi 时，记录最后一次交换位置 newHi，把右界直接设为 newHi；反向同理。
 * 一次无交换的正反向都未发生交换即停。时间最坏 `O(n²)`、最好 `O(n)`；空间 `O(1)`；原地、稳定。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function cocktailSortOptimized(
  arr: readonly number[],
  hooks: CocktailOptHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  let lo = 0;
  let hi = n - 1;

  while (lo < hi) {
    let newHi = lo; // 本轮正向最后交换位置（默认 lo 表示无交换）
    hooks.onForwardStart?.(lo, hi);
    for (let i = lo; i < hi; i++) {
      hooks.onCompare?.(i, i + 1);
      if (a[i]! > a[i + 1]!) {
        swap(i, i + 1);
        hooks.onSwap?.(i, i + 1);
        newHi = i;
      }
    }
    // [newHi+1, hi] 已就位
    for (let k = hi; k > newHi; k--) hooks.onSorted?.(k);
    if (newHi === lo) break; // 正向无交换 → 已有序
    hooks.onJumpHi?.(newHi);
    hi = newHi;

    let newLo = hi; // 反向最后交换位置（默认 hi 表示无交换）
    hooks.onBackwardStart?.(lo, hi);
    for (let i = hi; i > lo; i--) {
      hooks.onCompare?.(i - 1, i);
      if (a[i - 1]! > a[i]!) {
        swap(i - 1, i);
        hooks.onSwap?.(i - 1, i);
        newLo = i;
      }
    }
    // [lo, newLo-1] 已就位
    for (let k = lo; k < newLo; k++) hooks.onSorted?.(k);
    if (newLo === hi) break; // 反向无交换 → 已有序
    hooks.onJumpLo?.(newLo);
    lo = newLo;
  }
  // 兜底标记剩余
  for (let k = lo; k <= hi; k++) hooks.onSorted?.(k);
  return a;
}
