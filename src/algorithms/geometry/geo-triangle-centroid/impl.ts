// 三角形重心 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function centroid(a: Pt, b: Pt, c: Pt): Pt {
  return { x: (a.x + b.x + c.x) / 3, y: (a.y + b.y + c.y) / 3 };
}
