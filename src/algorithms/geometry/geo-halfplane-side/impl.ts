// 点在半平面侧 · 实现
export interface Pt {
  x: number;
  y: number;
}
export type Side = 'left' | 'right' | 'on';
export function halfPlaneSide(a: Pt, b: Pt, p: Pt): Side {
  const cr = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  if (cr > 1e-12) return 'left';
  if (cr < -1e-12) return 'right';
  return 'on';
}
