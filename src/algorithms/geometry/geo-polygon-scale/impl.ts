// 多边形缩放 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function scalePolygon(pts: Pt[], c: Pt, k: number): Pt[] {
  return pts.map((p) => ({ x: c.x + k * (p.x - c.x), y: c.y + k * (p.y - c.y) }));
}
