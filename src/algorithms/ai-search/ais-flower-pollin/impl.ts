// 花朵授粉算法 · 实现
export interface FpaHooks {
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
/** Lanczos 近似 gamma。 */
function gammaFunc(x: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gammaFunc(1 - x));
  x -= 1;
  let a = c[0]!;
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i]! / (x + i);
  return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}
function levyStep(rng: () => number, dim: number, beta = 1.5): number {
  const sigmaU = Math.pow(
    (gammaFunc(1 + beta) * Math.sin((Math.PI * beta) / 2)) /
      (gammaFunc((1 + beta) / 2) * beta * Math.pow(2, (beta - 1) / 2)),
    1 / beta,
  );
  const u = (rng() - 0.5) * sigmaU;
  const v = rng() - 0.5;
  return u / Math.pow(Math.abs(v), 1 / beta);
}
export function flowerPollination(
  dim: number,
  n: number,
  iters: number,
  p: number,
  seed = 43,
  hooks: FpaHooks = {},
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
    for (let i = 0; i < n; i++) {
      const cand = [...X[i]!];
      if (rng() < p) {
        // 全局授粉
        const L = levyStep(rng, dim);
        for (let d = 0; d < dim; d++) cand[d] = cand[d]! + L * (cand[d]! - best[d]!);
      } else {
        // 局部自花授粉
        const j = Math.floor(rng() * n);
        const k = Math.floor(rng() * n);
        const eps = rng();
        for (let d = 0; d < dim; d++) cand[d] = cand[d]! + eps * (X[j]![d]! - X[k]![d]!);
      }
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
