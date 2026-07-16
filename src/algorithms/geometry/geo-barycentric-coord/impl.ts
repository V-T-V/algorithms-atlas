// 重心坐标 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function barycentric(p: Pt, a: Pt, b: Pt, c: Pt): { u: number; v: number; w: number } {
  const d = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  if (Math.abs(d) < 1e-12) throw new RangeError('退化三角形');
  const u = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / d;
  const v = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / d;
  return { u, v, w: 1 - u - v };
}
