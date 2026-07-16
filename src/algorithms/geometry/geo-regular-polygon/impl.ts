// 正多边形顶点 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function regularPolygon(n: number, cx: number, cy: number, r: number, startAngle = 0): Pt[] {
  if (n < 3) throw new RangeError('边数 n 必须 ≥ 3');
  if (r < 0) throw new RangeError('半径必须非负');
  const pts: Pt[] = [];
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * k) / n + startAngle;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return pts;
}
