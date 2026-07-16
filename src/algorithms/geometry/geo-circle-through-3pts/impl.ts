// 三点定圆 · 实现
export interface Pt {
  x: number;
  y: number;
}
export interface Circle {
  center: Pt;
  radius: number;
}
export function circleThrough3(a: Pt, b: Pt, c: Pt): Circle {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) throw new RangeError('三点共线，无外接圆');
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
  const center = { x: ux, y: uy };
  return { center, radius: Math.hypot(a.x - ux, a.y - uy) };
}
