// 蝙蝠算法 · 实现
export interface BatHooks {
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
export function bat(
  dim: number,
  n: number,
  iters: number,
  fmin: number,
  fmax: number,
  A0: number,
  r0: number,
  alpha: number,
  gamma: number,
  seed = 23,
  hooks: BatHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  const V: number[][] = X.map((x) => x.map(() => 0));
  const F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!];
  let bestF = F[bi]!;
  let A = A0;
  let r = r0;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < n; i++) {
      const f = fmin + (fmax - fmin) * rng();
      for (let d = 0; d < dim; d++) {
        V[i]![d] = V[i]![d]! + (X[i]![d]! - best[d]!) * f;
        X[i]![d] = X[i]![d]! + V[i]![d]!;
      }
      const xi = [...X[i]!];
      // 局部随机游走
      if (rng() > r) {
        const d = Math.floor(rng() * dim);
        xi[d] = xi[d]! + (rng() - 0.5) * A * 2;
      }
      const cf = sphere(xi);
      if (cf < F[i]! && rng() < A) {
        X[i] = xi;
        F[i] = cf;
      }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) {
      bestF = F[bi]!;
      best = [...X[bi]!];
      hooks.onImprove?.(bestF, best);
    }
    A *= alpha;
    r = r0 * (1 - Math.exp(-gamma * it));
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
