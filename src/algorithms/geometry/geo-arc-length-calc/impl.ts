// 圆弧弧长 · 实现
export function arcLength(r: number, theta: number): number {
  if (r < 0) throw new RangeError('半径必须非负');
  if (theta < 0) throw new RangeError('角度必须非负');
  return r * theta;
}
