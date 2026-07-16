// 线段中点 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function midpoint(a: Pt, b: Pt): Pt {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
