// 点关于点反射 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function reflectAboutPoint(p: Pt, c: Pt): Pt {
  return { x: 2 * c.x - p.x, y: 2 * c.y - p.y };
}
