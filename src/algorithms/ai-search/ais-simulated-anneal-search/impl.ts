// 模拟退火 · 实现（1D 离散）
export interface AnnealHooks {
  onIter?: (x: number, val: number, T: number, accepted: boolean) => void;
  onImprove?: (x: number, val: number) => void;
  onDone?: (x: number, val: number) => void;
}
/** 目标地形（多峰）：最大化。 */
export function energy(x: number): number {
  return -(x - 7) * (x - 7) + 10 * Math.sin(x); // x=7 附近是主峰
}
/** 线性同余确定性随机（便于复现）。 */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function simulatedAnneal(
  start: number,
  min: number,
  max: number,
  T0: number,
  Tend: number,
  iters: number,
  seed = 42,
  hooks: AnnealHooks = {},
): { x: number; val: number } {
  const rng = makeRng(seed);
  let x = start;
  let v = energy(x);
  let bestX = x;
  let bestV = v;
  for (let i = 0; i < iters; i++) {
    const T = T0 * Math.pow(Tend / T0, i / iters);
    const cand = Math.max(min, Math.min(max, x + (rng() < 0.5 ? -1 : 1)));
    const cv = energy(cand);
    const dE = cv - v;
    const accepted = dE > 0 || rng() < Math.exp(dE / Math.max(1e-9, T));
    hooks.onIter?.(cand, cv, T, accepted);
    if (accepted) {
      x = cand;
      v = cv;
    }
    if (v > bestV) {
      bestV = v;
      bestX = x;
      hooks.onImprove?.(bestX, bestV);
    }
  }
  hooks.onDone?.(bestX, bestV);
  return { x: bestX, val: bestV };
}
