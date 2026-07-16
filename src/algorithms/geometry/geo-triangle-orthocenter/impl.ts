// 三角形垂心 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function orthocenter(a: Pt, b: Pt, c: Pt): Pt {
  // H = A + B + C - 2*O where O is circumcenter
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) throw new RangeError('三点共线');
  const ux =
    ((a.x * a.x + a.y * a.y) * (b.y - c.y) +
      (b.x * b.x + b.y * b.y) * (c.y - a.y) +
      (c.x * c.x + c.y * c.y) * (a.y - b.y)) /
    d;
  const uy =
    ((a.x * a.x + a.y * a.y) * (c.x - b.x) +
      (b.x * b.x + b.y * b.y) * (a.x - c.x) +
      (c.x * c.x + c.y * c.y) * (b.x - a.x)) /
    d;
  return { x: a.x + b.x + c.x - 2 * ux, y: a.y + b.y + c.y - 2 * uy };
}
