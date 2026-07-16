// 狼群算法 · 实现
export interface WolfHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function rastrigin(x: number[]): number {
  const A = 10;
  return A * x.length + x.reduce((s, v) => s + v * v - A * Math.cos(2 * Math.PI * v), 0);
}
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function wolfPack(
  dim: number,
  n: number,
  iters: number,
  stepScout: number,
  stepAttack: number,
  seed = 31,
  hooks: WolfHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  const F: number[] = X.map((x) => rastrigin(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!];
  let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    // 探狼阶段：每只狼向随机方向侦察
    for (let i = 0; i < n; i++) {
      const cand = X[i]!.map((v) => v + (rng() - 0.5) * stepScout);
      const cf = rastrigin(cand);
      if (cf < F[i]!) {
        X[i] = cand;
        F[i] = cf;
      }
    }
    // 猛狼阶段：朝首领靠近
    bi = F.indexOf(Math.min(...F));
    for (let i = 0; i < n; i++) {
      if (i === bi) continue;
      const cand = X[i]!.map((v, d) => v + stepAttack * (X[bi]![d]! - v));
      const cf = rastrigin(cand);
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
