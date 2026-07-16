// 完全平方数判定 · 实现
export interface PerfectSquareHooks {
  onProbe?: (mid: number, sq: number) => void;
  onConclude?: (isPerfect: boolean) => void;
}
export function miscIsPerfectSquare(num: number, hooks: PerfectSquareHooks = {}): boolean {
  if (num < 1) return false;
  let lo = 1;
  let hi = num;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const sq = mid * mid;
    hooks.onProbe?.(mid, sq);
    if (sq === num) {
      hooks.onConclude?.(true);
      return true;
    }
    if (sq < num) lo = mid + 1;
    else hi = mid - 1;
  }
  hooks.onConclude?.(false);
  return false;
}
