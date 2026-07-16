// 对偶变量法 · 纯算法实现
export interface AntitheticHooks {
  onPair?: (u: number, anti: number, fU: number, fAnti: number, avg: number) => void;
  onResult?: (estimate: number, variance: number) => void;
}

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/** 用对偶变量估计 ∫₀¹ f(x) dx。返回估计与方差。 */
export function antitheticIntegrate(
  f: (x: number) => number,
  N: number,
  rng: () => number = lcg(42),
  hooks: AntitheticHooks = {},
): { estimate: number; variance: number } {
  // N 必须为对偶对数（实际采样 N 次，每对产生 2 个观测，这里 N 表示对数）
  const pairs: number[] = [];
  for (let i = 0; i < N; i++) {
    const u = rng();
    const anti = 1 - u;
    const fU = f(u);
    const fAnti = f(anti);
    const avg = (fU + fAnti) / 2;
    pairs.push(avg);
    hooks.onPair?.(u, anti, fU, fAnti, avg);
  }
  const estimate = pairs.reduce((s, v) => s + v, 0) / N;
  const variance = pairs.reduce((s, v) => s + (v - estimate) ** 2, 0) / N;
  hooks.onResult?.(estimate, variance);
  return { estimate, variance };
}

/** 普通（无对偶）蒙特卡洛，用于对比方差。 */
export function crudeMonteCarlo(
  f: (x: number) => number,
  N: number,
  rng: () => number = lcg(42),
): { estimate: number; variance: number } {
  const vals: number[] = [];
  for (let i = 0; i < N; i++) vals.push(f(rng()));
  const estimate = vals.reduce((s, v) => s + v, 0) / N;
  const variance = vals.reduce((s, v) => s + (v - estimate) ** 2, 0) / N;
  return { estimate, variance };
}
