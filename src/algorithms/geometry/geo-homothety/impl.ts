// 位似变换 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function homothety(p: Pt, c: Pt, k: number): Pt {
  return { x: c.x + k * (p.x - c.x), y: c.y + k * (p.y - c.y) };
}
