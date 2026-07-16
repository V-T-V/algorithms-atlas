// 和声搜索 · 实现
export interface HsHooks {
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
export function harmonySearch(
  dim: number,
  hms: number,
  iters: number,
  hmcr: number,
  par: number,
  bw: number,
  lb: number,
  ub: number,
  seed = 37,
  hooks: HsHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const HM: number[][] = Array.from({ length: hms }, () =>
    Array.from({ length: dim }, () => lb + (ub - lb) * rng()),
  );
  const HF: number[] = HM.map((x) => sphere(x));
  for (let it = 0; it < iters; it++) {
    const x: number[] = [];
    for (let d = 0; d < dim; d++) {
      if (rng() < hmcr) {
        const pick = HM[Math.floor(rng() * hms)]![d]!;
        if (rng() < par) x.push(pick + (rng() - 0.5) * 2 * bw);
        else x.push(pick);
      } else {
        x.push(lb + (ub - lb) * rng());
      }
    }
    const f = sphere(x);
    const worstIdx = HF.indexOf(Math.max(...HF));
    if (f < HF[worstIdx]!) {
      HM[worstIdx] = x;
      HF[worstIdx] = f;
    }
    const bi = HF.indexOf(Math.min(...HF));
    hooks.onImprove?.(HF[bi]!, [...HM[bi]!]);
    hooks.onIter?.(it, HF[bi]!);
  }
  const bi = HF.indexOf(Math.min(...HF));
  hooks.onDone?.(HF[bi]!, HM[bi]!);
  return { best: HM[bi]!, fit: HF[bi]! };
}
