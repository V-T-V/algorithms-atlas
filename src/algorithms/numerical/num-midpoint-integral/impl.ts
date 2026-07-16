// 中点法积分 · 实现
export function midpointIntegral(f: (x: number) => number, a: number, b: number, n = 1000): number {
  if (n <= 0) throw new RangeError('n 必须为正');
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += f(a + (i + 0.5) * h);
  return sum * h;
}
