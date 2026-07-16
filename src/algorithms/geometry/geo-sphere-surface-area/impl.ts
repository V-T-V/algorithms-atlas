// 球表面积 · 实现
export function sphereSurfaceArea(r: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  return 4 * Math.PI * r * r;
}
