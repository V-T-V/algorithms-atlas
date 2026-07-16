// 差分进化 · 实现
export interface DeHooks {
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
export function differentialEvolution(
  dim: number,
  pop: number,
  iters: number,
  F: number,
  CR: number,
  lb: number,
  ub: number,
  seed = 59,
  hooks: DeHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: pop }, () =>
    Array.from({ length: dim }, () => lb + (ub - lb) * rng()),
  );
  const fit: number[] = X.map((x) => sphere(x));
  let bi = fit.indexOf(Math.min(...fit));
  let best = [...X[bi]!];
  let bestF = fit[bi]!;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < pop; i++) {
      // 选 3 个互不相同的随机个体
      const idxs = [0, 1, 2].map(() => {
        let k = Math.floor(rng() * pop);
        while (k === i) k = Math.floor(rng() * pop);
        return k;
      });
      const r1 = idxs[0]!;
      let r2 = idxs[1]!;
      let r3 = idxs[2]!;
      while (r2 === r1 || r2 === i) r2 = Math.floor(rng() * pop);
      while (r3 === r1 || r3 === r2 || r3 === i) r3 = Math.floor(rng() * pop);
      const mutant = X[r1]!.map((v, d) => v + F * (X[r2]![d]! - X[r3]![d]!));
      // 二项交叉
      const jrand = Math.floor(rng() * dim);
      const u = X[i]!.map((v, d) => {
        if (d === jrand || rng() < CR) return Math.max(lb, Math.min(ub, mutant[d]!));
        return v;
      });
      const fu = sphere(u);
      if (fu < fit[i]!) {
        X[i] = u;
        fit[i] = fu;
      }
    }
    bi = fit.indexOf(Math.min(...fit));
    if (fit[bi]! < bestF) {
      bestF = fit[bi]!;
      best = [...X[bi]!];
      hooks.onImprove?.(bestF, best);
    }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
