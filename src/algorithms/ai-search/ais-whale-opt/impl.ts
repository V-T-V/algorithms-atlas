// 鲸鱼优化算法 · 实现
export interface WoaHooks {
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
export function whaleOpt(
  dim: number,
  n: number,
  iters: number,
  b: number,
  seed = 67,
  hooks: WoaHooks = {},
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
    const a = 2 - 2 * (it / iters);
    for (let i = 0; i < n; i++) {
      const A = 2 * a * rng() - a;
      const C = 2 * rng();
      const p = rng();
      const cand = [...X[i]!];
      if (p < 0.5) {
        if (Math.abs(A) < 1) {
          // 收缩包围
          for (let d = 0; d < dim; d++) {
            const D = Math.abs(C * best[d]! - X[i]![d]!);
            cand[d] = best[d]! - A * D;
          }
        } else {
          // 随机探索
          const xr = X[Math.floor(rng() * n)]!;
          for (let d = 0; d < dim; d++) {
            const D = Math.abs(C * xr[d]! - X[i]![d]!);
            cand[d] = xr[d]! - A * D;
          }
        }
      } else {
        // 螺旋更新
        let D2 = 0;
        for (let d = 0; d < dim; d++) D2 += (best[d]! - X[i]![d]!) ** 2;
        const l = (rng() - 0.5) * 2;
        for (let d = 0; d < dim; d++) {
          cand[d] = D2 * Math.exp(b * l) * Math.cos(2 * Math.PI * l) + best[d]!;
        }
      }
      X[i] = cand;
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
