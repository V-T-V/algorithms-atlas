// 灯泡开关 · 实现
export interface BulbHooks {
  onConclude?: (lit: number) => void;
}
export function miscBulb2(n: number, hooks: BulbHooks = {}): number {
  if (n <= 0) return 0;
  const lit = Math.floor(Math.sqrt(n));
  hooks.onConclude?.(lit);
  return lit;
}
