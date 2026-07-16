// 灰狼优化 · 实现
export interface GwoHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number {
  return x.reduce((s, v) => s + v * v, 0);
}
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function greyWolf(
  dim: number,
  n: number,
  iters: number,
  seed = 61,
  hooks: GwoHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  const F: number[] = X.map((x) => sphere(x));
  const order = [...Array(n).keys()].sort((a, b) => F[a]! - F[b]!);
  let alpha = [...X[order[0]!]!];
  let beta = [...X[order[1]!]!];
  let delta = [...X[order[2]!]!];
  let bestF = F[order[0]!]!;
  let best = [...alpha];
  for (let it = 0; it < iters; it++) {
    const a = 2 - 2 * (it / iters);
    for (let i = 0; i < n; i++) {
      const newP: number[] = [];
      for (let d = 0; d < dim; d++) {
        const A1 = 2 * a * rng() - a;
        const C1 = 2 * rng();
        const A2 = 2 * a * rng() - a;
        const C2 = 2 * rng();
        const A3 = 2 * a * rng() - a;
        const C3 = 2 * rng();
        const Dalpha = Math.abs(C1 * alpha[d]! - X[i]![d]!);
        const Dbeta = Math.abs(C2 * beta[d]! - X[i]![d]!);
        const Ddelta = Math.abs(C3 * delta[d]! - X[i]![d]!);
        const x1 = alpha[d]! - A1 * Dalpha;
        const x2 = beta[d]! - A2 * Dbeta;
        const x3 = delta[d]! - A3 * Ddelta;
        newP.push((x1 + x2 + x3) / 3);
      }
      X[i] = newP;
      F[i] = sphere(X[i]!);
    }
    const order2 = [...Array(n).keys()].sort((a, b) => F[a]! - F[b]!);
    alpha = [...X[order2[0]!]!];
    beta = [...X[order2[1]!]!];
    delta = [...X[order2[2]!]!];
    if (F[order2[0]!]! < bestF) {
      bestF = F[order2[0]!]!;
      best = [...alpha];
      hooks.onImprove?.(bestF, best);
    }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
