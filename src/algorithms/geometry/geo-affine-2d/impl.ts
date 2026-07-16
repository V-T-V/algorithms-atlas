// 二维仿射变换 · 实现
export interface Pt {
  x: number;
  y: number;
}
export interface Affine {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}
export function affine(p: Pt, m: Affine): Pt {
  return { x: m.a * p.x + m.b * p.y + m.e, y: m.c * p.x + m.d * p.y + m.f };
}
