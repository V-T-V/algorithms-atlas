// 爬山搜索 · 实现（1D 离散）
export interface HillHooks {
  onStep?: (pos: number, val: number, improved: boolean) => void;
  onStuck?: (pos: number) => void;
}
/** 1D 适应度地形：f(x) = 多峰函数。 */
export function landscape(x: number): number {
  return 10 * Math.sin(x / 2) + 0.5 * x - 0.02 * x * x;
}
/** 在 x 处生成邻居（±step）。 */
export function neighbors(x: number, step: number, min: number, max: number): number[] {
  const out: number[] = [];
  if (x - step >= min) out.push(x - step);
  if (x + step <= max) out.push(x + step);
  return out;
}
/** 爬山：返回最终位置。 */
export function hillClimb(
  start: number,
  step: number,
  min: number,
  max: number,
  maxIter: number,
  hooks: HillHooks = {},
): { pos: number; val: number; iters: number } {
  let x = start;
  let v = landscape(x);
  for (let i = 0; i < maxIter; i++) {
    let bestN = x;
    let bestV = v;
    for (const n of neighbors(x, step, min, max)) {
      const nv = landscape(n);
      if (nv > bestV) {
        bestV = nv;
        bestN = n;
      }
    }
    if (bestN === x) {
      hooks.onStuck?.(x);
      hooks.onStep?.(x, v, false);
      return { pos: x, val: v, iters: i };
    }
    x = bestN;
    v = bestV;
    hooks.onStep?.(x, v, true);
  }
  return { pos: x, val: v, iters: maxIter };
}
