// 向量旋转 · 实现
export interface Vec2 {
  x: number;
  y: number;
}
export interface RotateHooks {
  onResult?: (v: Vec2) => void;
}
export function rotate(v: Vec2, theta: number, hooks: RotateHooks = {}): Vec2 {
  const c = Math.cos(theta),
    s = Math.sin(theta);
  const out = { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
  hooks.onResult?.(out);
  return out;
}
