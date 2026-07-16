// 向量投影 · 实现
export interface Vec2 {
  x: number;
  y: number;
}
export interface ProjectionHooks {
  onCoeff?: (k: number) => void;
  onResult?: (p: Vec2) => void;
}
export interface ProjectionResult {
  coeff: number;
  vec: Vec2;
}
export function project(a: Vec2, b: Vec2, hooks: ProjectionHooks = {}): ProjectionResult {
  const bb = b.x * b.x + b.y * b.y;
  if (bb === 0) throw new RangeError('目标向量为零');
  const coeff = (a.x * b.x + a.y * b.y) / bb;
  hooks.onCoeff?.(coeff);
  const vec = { x: coeff * b.x, y: coeff * b.y };
  hooks.onResult?.(vec);
  return { coeff, vec };
}
