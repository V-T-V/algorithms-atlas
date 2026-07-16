// 排列硬币 · 实现
export interface ArrangeCoinHooks {
  onProbe?: (mid: number, used: number) => void;
  onConclude?: (rows: number) => void;
}
export function miscArrangeCoin2(n: number, hooks: ArrangeCoinHooks = {}): number {
  if (n <= 0) return 0;
  let lo = 1;
  let hi = n;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const used = (mid * (mid + 1)) / 2;
    hooks.onProbe?.(mid, used);
    if (used === n) {
      hooks.onConclude?.(mid);
      return mid;
    }
    if (used < n) lo = mid + 1;
    else hi = mid - 1;
  }
  hooks.onConclude?.(hi);
  return hi;
}
