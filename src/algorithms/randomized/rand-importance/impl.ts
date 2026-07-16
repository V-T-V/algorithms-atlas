// 重要性采样 · 纯算法实现
export interface ImportanceHooks {
  onSample?: (x: number, weight: number, fValue: number) => void;
  onResult?: (estimate: number, variance: number) => void;
}

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/** Box-Muller 正态采样。 */
function normalSample(mean: number, std: number, rng: () => number): number {
  const u1 = Math.max(rng(), 1e-12);
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

/** 标准正态密度。 */
function normalPdf(x: number, mean: number, std: number): number {
  const z = (x - mean) / std;
  return Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
}

/**
 * 估计 E_p[f(X)]，X ~ p (标准正态)，从提议 q (mean=propMean) 采样。
 * f 默认为 x²。
 */
export function importanceSample(
  N: number,
  propMean: number,
  propStd = 1,
  f: (x: number) => number = (x) => x * x,
  rng: () => number = lcg(42),
  hooks: ImportanceHooks = {},
): { estimate: number; variance: number } {
  const pMean = 0;
  const pStd = 1;
  const samples: number[] = [];
  for (let i = 0; i < N; i++) {
    const x = normalSample(propMean, propStd, rng);
    const w = normalPdf(x, pMean, pStd) / normalPdf(x, propMean, propStd);
    const fv = f(x);
    samples.push(fv * w);
    hooks.onSample?.(x, w, fv);
  }
  const estimate = samples.reduce((s, v) => s + v, 0) / N;
  const variance = samples.reduce((s, v) => s + (v - estimate) ** 2, 0) / N;
  hooks.onResult?.(estimate, variance);
  return { estimate, variance };
}
