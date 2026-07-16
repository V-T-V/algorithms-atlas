// 磷虾群算法 · 实现（简化）
export interface KhHooks {
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
export function krillHerd(
  dim: number,
  n: number,
  iters: number,
  wN: number,
  wF: number,
  wD: number,
  seed = 53,
  hooks: KhHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10),
  );
  const F: number[] = X.map((x) => sphere(x));
  const N: number[][] = X.map((x) => [...x].map(() => 0));
  const Fo: number[][] = X.map((x) => [...x].map(() => 0));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!];
  let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    const Dmax = 0.2 * (1 - it / iters);
    for (let i = 0; i < n; i++) {
      // 诱导运动：朝最佳磷虾
      const Ni = N[i]!.map((_, d) => wN * (X[bi]![d]! - X[i]![d]!) + N[i]![d]!);
      // 觅食运动：朝个体历史食物（这里简化为最近邻）
      const neighbors = X.map((x, j) => ({
        j,
        d: j === i ? Infinity : Math.hypot(x[0]! - X[i]![0]!, x[1]! - X[i]![1]!),
      }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      const foodX = neighbors[0] ? X[neighbors[0].j]! : X[bi]!;
      const Fi = Fo[i]!.map((_, d) => wF * (foodX[d]! - X[i]![d]!) + Fo[i]![d]!);
      // 物理扩散
      const Di = Array.from({ length: dim }, () => wD * Dmax * (rng() - 0.5) * 2);
      for (let d = 0; d < dim; d++) {
        X[i]![d] = X[i]![d]! + Ni[d]! + Fi[d]! + Di[d]!;
      }
      N[i] = Ni;
      Fo[i] = Fi;
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
