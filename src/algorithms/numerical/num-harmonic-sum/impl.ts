// 调和级数部分和 · 实现
export function harmonicSum(n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  let s = 0;
  for (let i = 1; i <= n; i++) s += 1 / i;
  return s;
}
