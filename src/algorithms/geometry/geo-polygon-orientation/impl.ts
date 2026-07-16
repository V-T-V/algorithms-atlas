// 多边形方向 · 实现
export interface Pt {
  x: number;
  y: number;
}
export type Orientation = 'cw' | 'ccw' | 'degenerate';
export function polygonOrientation(pts: Pt[]): Orientation {
  const n = pts.length;
  if (n < 3) return 'degenerate';
  let s = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i]!,
      b = pts[(i + 1) % n]!;
    s += (b.x - a.x) * (b.y + a.y);
  }
  if (s > 0) return 'cw';
  if (s < 0) return 'ccw';
  return 'degenerate';
}
