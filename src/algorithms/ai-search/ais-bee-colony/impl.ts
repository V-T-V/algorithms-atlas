// 人工蜂群 · 实现
export interface AbcHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onScout?: (idx: number) => void;
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
export function abc(
  dim: number,
  half: number,
  iters: number,
  limit: number,
  seed = 17,
  hooks: AbcHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const N = half * 2;
  const X: number[][] = Array.from({ length: half }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  const F: number[] = X.map((x) => sphere(x));
  const trials: number[] = Array.from({ length: half }, () => 0);
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!];
  let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    // 采蜜蜂阶段
    for (let i = 0; i < half; i++) {
      const k = (i + 1 + Math.floor(rng() * (half - 1))) % half;
      const d = Math.floor(rng() * dim);
      const cand = [...X[i]!];
      cand[d] = cand[d]! + (X[i]![d]! - X[k]![d]!) * (rng() * 2 - 1);
      const cf = sphere(cand);
      if (cf < F[i]!) {
        X[i] = cand;
        F[i] = cf;
        trials[i] = 0;
      } else trials[i]!++;
    }
    // 观察蜂阶段：轮盘赌
    const max = Math.max(...F);
    const probs = F.map((f) => 1 / (1 + f)); // 越小越优
    const sum = probs.reduce((a, b) => a + b, 0);
    for (let s = 0; s < half; s++) {
      let r = rng() * sum;
      let pick = 0;
      for (let i = 0; i < half; i++) {
        r -= probs[i]!;
        if (r <= 0) {
          pick = i;
          break;
        }
      }
      const k = (pick + 1 + Math.floor(rng() * (half - 1))) % half;
      const d = Math.floor(rng() * dim);
      const cand = [...X[pick]!];
      cand[d] = cand[d]! + (X[pick]![d]! - X[k]![d]!) * (rng() * 2 - 1);
      const cf = sphere(cand);
      if (cf < F[pick]!) {
        X[pick] = cand;
        F[pick] = cf;
        trials[pick] = 0;
      } else trials[pick]!++;
    }
    // 侦查蜂阶段
    for (let i = 0; i < half; i++) {
      if (trials[i]! > limit) {
        X[i] = Array.from({ length: dim }, () => (rng() - 0.5) * 10);
        F[i] = sphere(X[i]!);
        trials[i] = 0;
        hooks.onScout?.(i);
      }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) {
      bestF = F[bi]!;
      best = [...X[bi]!];
      hooks.onImprove?.(bestF, best);
    }
    hooks.onIter?.(it, bestF);
    void max;
    void N;
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
