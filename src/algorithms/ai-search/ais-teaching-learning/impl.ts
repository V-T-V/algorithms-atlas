// 教与学优化 · 实现
export interface TlboHooks {
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
export function tlbo(
  dim: number,
  pop: number,
  iters: number,
  seed = 47,
  hooks: TlboHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: pop }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  const F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!];
  let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    // 教师阶段
    const teacher = bi;
    const mean: number[] = Array.from(
      { length: dim },
      (_, d) => X.reduce((s, x) => s + x[d]!, 0) / pop,
    );
    const TF = 1 + Math.floor(rng() * 2 + 1); // 1 或 2
    for (let i = 0; i < pop; i++) {
      const cand = X[i]!.map((v, d) => v + rng() * (X[teacher]![d]! - TF * mean[d]!));
      const cf = sphere(cand);
      if (cf < F[i]!) {
        X[i] = cand;
        F[i] = cf;
      }
    }
    // 学习阶段
    for (let i = 0; i < pop; i++) {
      let j = Math.floor(rng() * pop);
      while (j === i) j = Math.floor(rng() * pop);
      const cand = [...X[i]!];
      if (F[i]! < F[j]!)
        for (let d = 0; d < dim; d++) cand[d] = cand[d]! + rng() * (X[i]![d]! - X[j]![d]!);
      else for (let d = 0; d < dim; d++) cand[d] = cand[d]! + rng() * (X[j]![d]! - X[i]![d]!);
      const cf = sphere(cand);
      if (cf < F[i]!) {
        X[i] = cand;
        F[i] = cf;
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
