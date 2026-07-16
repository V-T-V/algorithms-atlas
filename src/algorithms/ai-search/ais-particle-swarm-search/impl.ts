// 粒子群优化 · 实现
export interface PsoHooks {
  onIter?: (iter: number, gbest: number[], gfit: number) => void;
  onImprove?: (gbest: number[], gfit: number) => void;
  onDone?: (gbest: number[], gfit: number) => void;
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
export function pso(
  dim: number,
  pop: number,
  iters: number,
  w: number,
  c1: number,
  c2: number,
  seed = 11,
  hooks: PsoHooks = {},
): { gbest: number[]; gfit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: pop }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  const V: number[][] = X.map((p) => p.map(() => (rng() - 0.5) * 2));
  const P = X.map((p) => [...p]);
  const Pf = P.map((p) => sphere(p));
  const gi = Pf.indexOf(Math.min(...Pf));
  let gbest = [...P[gi]!];
  let gfit = Pf[gi]!;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < pop; i++) {
      for (let d = 0; d < dim; d++) {
        const r1 = rng();
        const r2 = rng();
        V[i]![d] =
          w * V[i]![d]! + c1 * r1 * (P[i]![d]! - X[i]![d]!) + c2 * r2 * (gbest[d]! - X[i]![d]!);
        X[i]![d] = X[i]![d]! + V[i]![d]!;
      }
      const f = sphere(X[i]!);
      if (f < Pf[i]!) {
        Pf[i] = f;
        P[i] = [...X[i]!];
      }
      if (f < gfit) {
        gfit = f;
        gbest = [...X[i]!];
        hooks.onImprove?.(gbest, gfit);
      }
    }
    hooks.onIter?.(it, gbest, gfit);
  }
  hooks.onDone?.(gbest, gfit);
  return { gbest, gfit };
}
