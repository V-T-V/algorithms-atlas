// 矩形法积分 · 实现
export function rectangleIntegral(
  f: (x: number) => number,
  a: number,
  b: number,
  n = 1000,
): number {
  if (n <= 0) throw new RangeError('n 必须为正');
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + i * h);
  return sum * h;
}
