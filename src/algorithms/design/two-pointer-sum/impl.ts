// 两数之和（双指针·有序）· 纯算法实现

/** 事件钩子。 */
export interface TwoSumHooks {
  /** 比较 a[L]+a[R] 与 target。 */
  onCompare?: (L: number, R: number, sum: number, target: number) => void;
  /** 移动指针。 */
  onMove?: (which: 'L' | 'R', from: number, to: number) => void;
  /** 命中解。 */
  onFound?: (L: number, R: number) => void;
}

export interface TwoSumResult {
  pair: [number, number] | null;
}

/**
 * 有序数组两数之和：返回和等于 target 的一对下标（升序输入）。
 * 若有多解，返回最先碰到的一对；无解返回 null。
 */
export function twoSum(
  arr: readonly number[],
  target: number,
  hooks: TwoSumHooks = {},
): TwoSumResult {
  if (arr.length < 2) return { pair: null };
  let L = 0;
  let R = arr.length - 1;
  while (L < R) {
    const sum = arr[L]! + arr[R]!;
    hooks.onCompare?.(L, R, sum, target);
    if (sum === target) {
      hooks.onFound?.(L, R);
      return { pair: [L, R] };
    }
    if (sum < target) {
      const from = L;
      L++;
      hooks.onMove?.('L', from, L);
    } else {
      const from = R;
      R--;
      hooks.onMove?.('R', from, R);
    }
  }
  return { pair: null };
}
