// 布谷鸟搜索 · 实现
export interface CsHooks {
  onIter?: (i: number, best: number[], bestFit: number) => void;
  onConclude?: (best: number[], bestFit: number) => void;
}
function levy(d: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < d; i++)
    out.push(((Math.random() - 0.5) * 2) / Math.pow(Math.random() + 0.01, 1.5));
  return out;
}
export function cuckoo(
  f: (x: readonly number[]) => number,
  dim: number,
  n = 15,
  maxIter = 40,
  pa = 0.25,
  hooks: CsHooks = {},
): { best: number[]; bestFit: number } {
  const nests = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (Math.random() - 0.5) * 10),
  );
  const fits = nests.map((p) => f(p));
  for (let it = 0; it < maxIter; it++) {
    const i = Math.floor(Math.random() * n);
    const step = levy(dim);
    const newNest = nests[i]!.map((v, d) => v + step[d]!);
    const newFit = f(newNest);
    const j = Math.floor(Math.random() * n);
    if (newFit < fits[j]!) {
      nests[j] = newNest;
      fits[j] = newFit;
    }
    // 弃最差 pa 比例
    const order = fits.map((v, idx) => ({ v, idx })).sort((a, b) => b.v - a.v);
    for (let k = 0; k < Math.floor(n * pa); k++) {
      const idx = order[k]!.idx;
      nests[idx] = Array.from({ length: dim }, () => (Math.random() - 0.5) * 10);
      fits[idx] = f(nests[idx]!);
    }
    const bi = fits.reduce((b, _, idx) => (fits[idx]! < fits[b]! ? idx : b), 0);
    hooks.onIter?.(it, [...nests[bi]!], fits[bi]!);
  }
  const bi = fits.reduce((b, _, idx) => (fits[idx]! < fits[b]! ? idx : b), 0);
  hooks.onConclude?.([...nests[bi]!], fits[bi]!);
  return { best: [...nests[bi]!], bestFit: fits[bi]! };
}
