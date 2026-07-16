// 数列求和 · 实现
export function summation(f: (i: number) => number, n: number): number {
  if (n < 0) throw new RangeError('n 不能为负');
  let s = 0;
  for (let i = 0; i < n; i++) s += f(i);
  return s;
}
