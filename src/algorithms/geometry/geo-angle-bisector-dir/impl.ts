// 角平分线方向 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function angleBisector(v: Pt, a: Pt, b: Pt): Pt {
  const u1x = a.x - v.x,
    u1y = a.y - v.y;
  const u2x = b.x - v.x,
    u2y = b.y - v.y;
  const n1 = Math.hypot(u1x, u1y),
    n2 = Math.hypot(u2x, u2y);
  if (n1 === 0 || n2 === 0) throw new RangeError('退化角度');
  return { x: u1x / n1 + u2x / n2, y: u1y / n1 + u2y / n2 };
}
