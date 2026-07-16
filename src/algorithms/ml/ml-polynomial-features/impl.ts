// 多项式特征扩展 · 实现
export function polynomialFeatures(x: number, degree: number): number[] {
  if (degree < 0) throw new RangeError('阶数必须非负');
  const out: number[] = [1];
  for (let d = 1; d <= degree; d++) out.push(out[out.length - 1]! * x);
  return out;
}
