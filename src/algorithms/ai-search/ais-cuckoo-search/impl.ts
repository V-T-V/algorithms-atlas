// 布谷鸟搜索 · 实现
export interface CsHooks {
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
/** Lanczos 近似 gamma 函数（用于 Lévy 步长）。 */
function gammaFunc(x: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (x < 0.5) {
    return Math.PI / (Math.sin(Math.PI * x) * gammaFunc(1 - x));
  }
  x -= 1;
  let a = c[0]!;
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) {
    a += c[i]! / (x + i);
  }
  return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}
/** Mantegna 近似 Lévy 步长（β=1.5）。 */
function levy(rng: () => number, dim: number, beta = 1.5): number[] {
  const sigmaU = Math.pow(
    (gammaFunc(1 + beta) * Math.sin((Math.PI * beta) / 2)) /
      (gammaFunc((1 + beta) / 2) * beta * Math.pow(2, (beta - 1) / 2)),
    1 / beta,
  );
  const out: number[] = [];
  for (let d = 0; d < dim; d++) {
    const u = (rng() - 0.5) * sigmaU;
    const v = rng() - 0.5;
    out.push(u / Math.pow(Math.abs(v), 1 / beta));
  }
  return out;
}
export function cuckoo(
  dim: number,
  n: number,
  iters: number,
  pa: number,
  alpha: number,
  seed = 29,
  hooks: CsHooks = {},
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
    // 每个巢产生新解（Lévy 飞行）
    for (let i = 0; i < n; i++) {
      const L = levy(rng, dim);
      const cand = X[i]!.map((v, d) => v + alpha * L[d]! * (v - best[d]!));
      const j = Math.floor(rng() * n);
      if (sphere(cand) < F[j]!) {
        X[j] = cand;
        F[j] = sphere(cand);
      }
    }
    // 丢弃最差 pa 比例，随机重生
    const order = [...Array(n).keys()].sort((a, b) => F[b]! - F[a]!);
    const abandon = Math.floor(n * pa);
    for (let k = 0; k < abandon; k++) {
      const idx = order[k]!;
      X[idx] = Array.from({ length: dim }, () => (rng() - 0.5) * 10);
      F[idx] = sphere(X[idx]!);
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
