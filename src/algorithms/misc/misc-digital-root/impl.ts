// 数根 · 实现
export interface DrHooks {
  onConclude?: (root: number) => void;
}
export function digitalRoot(n: number, hooks: DrHooks = {}): number {
  if (n === 0) {
    hooks.onConclude?.(0);
    return 0;
  }
  const r = 1 + ((n - 1) % 9);
  hooks.onConclude?.(r);
  return r;
}
