// =============================================================================
// 有效完全平方数 · 纯算法实现
// =============================================================================

export interface ValidSquareHooks {
  onProbe?: (mid: number, sq: number) => void;
}

export function isPerfectSquare(num: number, hooks: ValidSquareHooks = {}): boolean {
  if (num < 1) return false;
  let lo = 1;
  let hi = num;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const sq = mid * mid;
    hooks.onProbe?.(mid, sq);
    if (sq === num) return true;
    if (sq < num) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

/** 牛顿迭代法（验证用）。 */
export function isPerfectSquareNewton(num: number): boolean {
  if (num < 1) return false;
  let x = num;
  while (x * x > num) x = Math.floor((x + Math.floor(num / x)) / 2);
  return x * x === num;
}
