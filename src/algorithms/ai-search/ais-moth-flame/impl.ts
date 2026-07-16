// 飞蛾扑火优化 · 实现
export interface MfoHooks {
  onIter?: (iter: number, bestFit: number, flameN: number) => void;
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
export function mothFlame(
  dim: number,
  n: number,
  iters: number,
  b: number,
  seed = 71,
  hooks: MfoHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const M: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  let best: number[] = [...M[0]!];
  let bestF = sphere(best);
  for (let it = 0; it < iters; it++) {
    const flameN = Math.max(1, Math.round(n - (it * (n - 1)) / iters));
    // 排序得到当前火焰（最优 flameN 个飞蛾）
    const F = M.map((x, i) => ({ x: [...x], f: sphere(x), i }))
      .sort((a, b) => a.f - b.f)
      .slice(0, flameN);
    const a = -1 + it * (-1 / iters); // -1 → 0
    for (let i = 0; i < n; i++) {
      const fj = F[Math.min(i, flameN - 1)]!;
      const t = (a + 1) * rng() + a; // [-1, 1]
      for (let d = 0; d < dim; d++) {
        const D = Math.abs(fj.x[d]! - M[i]![d]!);
        M[i]![d] = D * Math.exp(b * t) * Math.cos(2 * Math.PI * t) + fj.x[d]!;
      }
      const f = sphere(M[i]!);
      if (f < bestF) {
        bestF = f;
        best = [...M[i]!];
        hooks.onImprove?.(bestF, best);
      }
    }
    hooks.onIter?.(it, bestF, flameN);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
