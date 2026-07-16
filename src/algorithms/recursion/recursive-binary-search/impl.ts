// 递归二分查找 · 纯算法实现

/** 事件钩子。 */
export interface RbsHooks {
  /** 进入区间 [lo, hi]，比较中点 mid。 */
  onProbe?: (lo: number, hi: number, mid: number, midValue: number) => void;
  /** 命中目标。 */
  onFound?: (mid: number) => void;
  /** 区间为空（未找到）。 */
  onEmpty?: (lo: number, hi: number) => void;
}

/**
 * 递归二分查找。
 *
 * @param sorted 已排序数组
 * @param target 目标值
 * @param hooks 可选事件钩子
 * @returns 目标下标（未找到返回 −1）
 */
export function recursiveBinarySearch(
  sorted: readonly number[],
  target: number,
  hooks: RbsHooks = {},
): number {
  const search = (lo: number, hi: number, depth: number): number => {
    void depth;
    if (lo > hi) {
      hooks.onEmpty?.(lo, hi);
      return -1;
    }
    const mid = (lo + hi) >> 1;
    const mv = sorted[mid]!;
    hooks.onProbe?.(lo, hi, mid, mv);
    if (mv === target) {
      hooks.onFound?.(mid);
      return mid;
    }
    if (target < mv) return search(lo, mid - 1, depth + 1);
    return search(mid + 1, hi, depth + 1);
  };
  return search(0, sorted.length - 1, 0);
}
