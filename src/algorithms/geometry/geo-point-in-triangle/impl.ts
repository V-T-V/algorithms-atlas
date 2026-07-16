// 点在三角形内 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function pointInTriangle(p: Pt, a: Pt, b: Pt, c: Pt): boolean {
  const d = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  if (Math.abs(d) < 1e-12) return false;
  const u = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / d;
  const v = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / d;
  const w = 1 - u - v;
  return u >= -1e-9 && v >= -1e-9 && w >= -1e-9;
}
