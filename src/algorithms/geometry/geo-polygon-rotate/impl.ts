// 多边形旋转 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function rotatePolygon(pts: Pt[], c: Pt, theta: number): Pt[] {
  const cs = Math.cos(theta),
    sn = Math.sin(theta);
  return pts.map((p) => {
    const dx = p.x - c.x,
      dy = p.y - c.y;
    return { x: c.x + dx * cs - dy * sn, y: c.y + dx * sn + dy * cs };
  });
}
