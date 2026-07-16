// 引力搜索算法 · 实现
export interface GsaHooks {
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
export function gsa(
  dim: number,
  n: number,
  iters: number,
  G0: number,
  seed = 41,
  hooks: GsaHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 20),
  );
  const V: number[][] = X.map((x) => x.map(() => 0));
  const F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!];
  let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    const G = G0 * Math.exp(-it / iters);
    const worst = Math.max(...F);
    const bestFit = Math.min(...F);
    const M: number[] = F.map((f) => (worst === bestFit ? 1 : (worst - f) / (worst - bestFit)));
    const sumM = M.reduce((a, b) => a + b, 0) || 1;
    const m: number[] = M.map((mi) => mi / sumM);
    // 计算每个粒子受到的合力（随机加权）
    const forces: number[][] = X.map(() => Array.from({ length: dim }, () => 0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        let r2 = 0;
        for (let d = 0; d < dim; d++) r2 += (X[i]![d]! - X[j]![d]!) ** 2;
        r2 = Math.max(r2, 1e-6);
        for (let d = 0; d < dim; d++) {
          forces[i]![d] = forces[i]![d]! + (rng() * G * m[j]! * (X[j]![d]! - X[i]![d]!)) / r2;
        }
      }
    }
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < dim; d++) {
        const a = forces[i]![d]! / Math.max(m[i]!, 1e-6);
        V[i]![d] = rng() * V[i]![d]! + a;
        X[i]![d] = X[i]![d]! + V[i]![d]!;
      }
      F[i] = sphere(X[i]!);
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
