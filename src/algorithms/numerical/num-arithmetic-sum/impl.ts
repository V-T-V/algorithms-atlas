// 等差数列求和 · 实现
export function arithmeticSum(a0: number, d: number, n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  return (n * (2 * a0 + (n - 1) * d)) / 2;
}
