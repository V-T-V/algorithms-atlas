// 四边形面积 · 实现
export interface Pt {
  x: number;
  y: number;
}
export function quadrilateralArea(a: Pt, b: Pt, c: Pt, d: Pt): number {
  const pts = [a, b, c, d];
  let s = 0;
  for (let i = 0; i < 4; i++) {
    const p = pts[i]!,
      q = pts[(i + 1) % 4]!;
    s += p.x * q.y - q.x * p.y;
  }
  return Math.abs(s) / 2;
}
