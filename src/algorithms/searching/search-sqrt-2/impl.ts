// 整数平方根（二分）· 纯算法实现
export interface Sqrt2Hooks {
  onTry?: (mid: number) => void;
}

export function sqrtSearch2(x: number, hooks: Sqrt2Hooks = {}): number {
  if (x < 2) return x;
  let lo = 1,
    hi = Math.floor(x / 2),
    ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onTry?.(mid);
    if (mid <= Math.floor(x / mid)) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}
