// 椭圆周长 · 实现
export function ellipsePerimeter(a: number, b: number): number {
  if (a < 0 || b < 0) throw new RangeError('半轴必须非负');
  return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
}
