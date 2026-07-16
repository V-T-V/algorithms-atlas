// 三点共线判定 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function areCollinear(a: Pt, b: Pt, c: Pt, eps = 1e-9): boolean {
  const cr = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  return Math.abs(cr) < eps;
}
