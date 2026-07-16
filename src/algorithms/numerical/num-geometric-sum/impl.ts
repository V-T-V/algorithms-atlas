// 等比数列求和 · 实现
export function geometricSum(r: number, n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  if (r === 1) return n;
  return (1 - Math.pow(r, n)) / (1 - r);
}
