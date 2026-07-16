// 史密斯数 · 实现
export interface SnHooks {
  onFactor?: (p: number) => void;
  onConclude?: (digitSum: number, factorSum: number, isSmith: boolean) => void;
}
function digitSum(n: number): number {
  let s = 0;
  while (n > 0) {
    s += n % 10;
    n = Math.floor(n / 10);
  }
  return s;
}
export function isSmithNumber(n: number, hooks: SnHooks = {}): boolean {
  if (n < 2) {
    hooks.onConclude?.(0, 0, false);
    return false;
  }
  let m = n,
    factorSum = 0;
  for (let p = 2; p * p <= m; p++) {
    while (m % p === 0) {
      factorSum += digitSum(p);
      hooks.onFactor?.(p);
      m = Math.floor(m / p);
    }
  }
  if (m > 1) {
    if (m === n) {
      hooks.onConclude?.(0, 0, false);
      return false;
    }
    factorSum += digitSum(m);
    hooks.onFactor?.(m);
  }
  const ds = digitSum(n);
  const isSmith = ds === factorSum;
  hooks.onConclude?.(ds, factorSum, isSmith);
  return isSmith;
}
