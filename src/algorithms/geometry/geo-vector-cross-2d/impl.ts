// 二维叉积 · 实现
export interface Vec2 {
  x: number;
  y: number;
}
export interface CrossHooks {
  onResult?: (c: number) => void;
}
export function cross2D(a: Vec2, b: Vec2, hooks: CrossHooks = {}): number {
  const c = a.x * b.y - a.y * b.x;
  hooks.onResult?.(c);
  return c;
}
export function turn(a: Vec2, b: Vec2, c: Vec2): 'left' | 'right' | 'collinear' {
  const cr = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  if (cr > 0) return 'left';
  if (cr < 0) return 'right';
  return 'collinear';
}
