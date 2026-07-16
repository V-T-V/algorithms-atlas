// 线段长度 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function segmentLength(a: Pt, b: Pt): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
