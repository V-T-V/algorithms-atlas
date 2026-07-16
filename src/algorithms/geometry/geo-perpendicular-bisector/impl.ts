// 中垂线 · 实现
export interface Pt {
  x: number;
  y: number;
}
export interface Line {
  a: number;
  b: number;
  c: number;
}
export function perpendicularBisector(a: Pt, b: Pt): Line {
  const mx = (a.x + b.x) / 2,
    my = (a.y + b.y) / 2;
  const dx = b.x - a.x,
    dy = b.y - a.y;
  // normal = (dx, dy), passes midpoint
  return { a: dx, b: dy, c: -(dx * mx + dy * my) };
}
