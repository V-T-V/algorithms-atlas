// 多边形周长 · 实现
export interface Pt {
  x: number;
  y: number;
}
export interface PerimeterHooks {
  onEdge?: (i: number, len: number) => void;
}
export function polygonPerimeter(pts: Pt[], hooks: PerimeterHooks = {}): number {
  const n = pts.length;
  if (n < 2) return 0;
  let p = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i]!,
      b = pts[(i + 1) % n]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    p += len;
    hooks.onEdge?.(i, len);
  }
  return p;
}
