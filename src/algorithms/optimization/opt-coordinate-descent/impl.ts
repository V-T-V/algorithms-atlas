// 坐标下降 · 实现
export interface CdHooks {
  onIter?: (i: number, dim: number, x: number[], fx: number) => void;
  onConclude?: (xmin: number[], fmin: number) => void;
}
export function coordinateDescent(
  f: (x: readonly number[]) => number,
  x0: number[],
  maxIter = 100,
  step = 0.1,
  hooks: CdHooks = {},
): { x: number[]; fx: number } {
  const x = [...x0];
  let fx = f(x);
  for (let it = 0; it < maxIter; it++) {
    let improved = false;
    for (let d = 0; d < x.length; d++) {
      const best = x[d]!;
      const f1 = (() => {
        x[d] = best + step;
        return f(x);
      })();
      const f2 = (() => {
        x[d] = best - step;
        return f(x);
      })();
      if (f1 < fx && f1 <= f2) {
        x[d] = best + step;
        fx = f1;
        improved = true;
      } else if (f2 < fx) {
        x[d] = best - step;
        fx = f2;
        improved = true;
      } else x[d] = best;
      hooks.onIter?.(it, d, x, fx);
    }
    if (!improved) break;
  }
  hooks.onConclude?.(x, fx);
  return { x, fx };
}
