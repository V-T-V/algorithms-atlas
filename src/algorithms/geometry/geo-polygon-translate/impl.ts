// 多边形平移 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function translatePolygon(pts: Pt[], dx: number, dy: number): Pt[] {
  return pts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
}
