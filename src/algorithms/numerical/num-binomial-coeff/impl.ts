// 二项式系数 · 实现
export function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n || n < 0) throw new RangeError('非法参数');
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) {
    r = (r * (n - i)) / (i + 1);
  }
  return Math.round(r);
}
