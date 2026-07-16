// 萤火虫算法 · 实现
export interface FfaHooks {
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
export function firefly(
  dim: number,
  n: number,
  iters: number,
  beta0: number,
  gamma: number,
  alpha: number,
  seed = 19,
  hooks: FfaHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  const F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!];
  let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (F[j]! < F[i]!) {
          const r2 = X[i]!.reduce((s, v, d) => s + (v - X[j]![d]!) ** 2, 0);
          const beta = beta0 * Math.exp(-gamma * r2);
          for (let d = 0; d < dim; d++) {
            X[i]![d] = X[i]![d]! + beta * (X[j]![d]! - X[i]![d]!) + alpha * (rng() - 0.5);
          }
          F[i] = sphere(X[i]!);
        }
      }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) {
      bestF = F[bi]!;
      best = [...X[bi]!];
      hooks.onImprove?.(bestF, best);
    }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
