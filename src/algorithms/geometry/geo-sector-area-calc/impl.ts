// 扇形面积 · 实现
export function sectorArea(r: number, theta: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  if (theta < 0) throw new RangeError('角度必须非负');
  return 0.5 * r * r * theta;
}
