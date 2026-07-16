// Gift Wrapping 凸包 · 实现
export interface Pt {
  x: number;
  y: number;
}
export interface GwHooks {
  onVertex?: (p: Pt) => void;
  onConclude?: (hull: Pt[]) => void;
}
export function giftWrapping(points: readonly Pt[], hooks: GwHooks = {}): Pt[] {
  if (points.length < 3) return [...points];
  let start = 0;
  for (let i = 1; i < points.length; i++)
    if (
      points[i]!.y < points[start]!.y ||
      (points[i]!.y === points[start]!.y && points[i]!.x < points[start]!.x)
    )
      start = i;
  const hull: Pt[] = [];
  let p = start;
  for (;;) {
    hull.push(points[p]!);
    hooks.onVertex?.(points[p]!);
    let q = (p + 1) % points.length;
    for (let r = 0; r < points.length; r++) {
      if (r === p) continue;
      const cross =
        (points[q]!.x - points[p]!.x) * (points[r]!.y - points[p]!.y) -
        (points[q]!.y - points[p]!.y) * (points[r]!.x - points[p]!.x);
      if (cross < 0) q = r;
    }
    p = q;
    if (p === start) break;
  }
  hooks.onConclude?.(hull);
  return hull;
}
