// 割线法 · 实现
export interface ScHooks {
  onIter?: (i: number, x: number, fx: number) => void;
  onConclude?: (root: number, iters: number) => void;
}
export function secantMethod(
  f: (x: number) => number,
  x0: number,
  x1: number,
  tol = 1e-9,
  maxIter = 50,
  hooks: ScHooks = {},
): number {
  let prev = x0,
    cur = x1;
  for (let i = 0; i < maxIter; i++) {
    const fp = f(prev),
      fc = f(cur);
    hooks.onIter?.(i, cur, fc);
    if (Math.abs(fc) < tol) {
      hooks.onConclude?.(cur, i);
      return cur;
    }
    const next = cur - (fc * (cur - prev)) / (fc - fp);
    prev = cur;
    cur = next;
  }
  hooks.onConclude?.(cur, maxIter);
  return cur;
}
