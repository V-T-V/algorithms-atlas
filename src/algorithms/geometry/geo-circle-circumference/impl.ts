// 圆周长 · 实现
export function circleCircumference(r: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  return 2 * Math.PI * r;
}
