// 三角形带符号面积 · 实现
export interface Pt {
  x: number;
  y: number;
}
export interface AreaHooks {
  onResult?: (s: number) => void;
}
export function signedArea(a: Pt, b: Pt, c: Pt, hooks: AreaHooks = {}): number {
  const s = ((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
  hooks.onResult?.(s);
  return s;
}
