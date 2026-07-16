// 向量夹角 · 实现
export interface Vec2 {
  x: number;
  y: number;
}
export interface VectorAngleHooks {
  onDot?: (d: number) => void;
  onResult?: (t: number) => void;
}
export function vectorAngle(a: Vec2, b: Vec2, hooks: VectorAngleHooks = {}): number {
  const dot = a.x * b.x + a.y * b.y;
  const na = Math.hypot(a.x, a.y);
  const nb = Math.hypot(b.x, b.y);
  hooks.onDot?.(dot);
  if (na === 0 || nb === 0) throw new RangeError('零向量无方向');
  const cos = Math.max(-1, Math.min(1, dot / (na * nb)));
  const theta = Math.acos(cos);
  hooks.onResult?.(theta);
  return theta;
}
