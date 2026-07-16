// 三角形内心 · 实现
export interface Pt {
  x: number;
  y: number;
}
export interface CircleResult {
  center: Pt;
  radius: number;
}
export function incenter(a: Pt, b: Pt, c: Pt): CircleResult {
  const la = Math.hypot(b.x - c.x, b.y - c.y);
  const lb = Math.hypot(a.x - c.x, a.y - c.y);
  const lc = Math.hypot(a.x - b.x, a.y - b.y);
  const s = la + lb + lc;
  if (s === 0) throw new RangeError('退化三角形');
  const center = {
    x: (la * a.x + lb * b.x + lc * c.x) / s,
    y: (la * a.y + lb * b.y + lc * c.y) / s,
  };
  const semi = s / 2;
  const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
  const radius = area / semi;
  return { center, radius };
}
