// 圆面积 · 实现
export function circleArea(r: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  return Math.PI * r * r;
}
