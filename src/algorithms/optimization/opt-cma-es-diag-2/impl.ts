// 对角 CMA-ES · 简化实现
export interface CmaDiagHooks {
  onGen?: (gen: number, mean: number[], sigma: number) => void;
}
export interface CmaDiagResult {
  params: number[];
  value: number;
  iterations: number;
  converged: boolean;
}
export function optCmaEsDiag2(
  f: (p: number[]) => number,
  _grad: (p: number[]) => number[],
  init: number[],
  opts: {
    sigma?: number;
    lambda?: number;
    mu?: number;
    maxIter?: number;
    tol?: number;
    seed?: number;
  } = {},
  hooks: CmaDiagHooks = {},
): CmaDiagResult {
  const { sigma = 1.0, lambda = 8, mu = 4, maxIter = 200, tol = 1e-8, seed = 42 } = opts;
  const mean = [...init];
  const d = mean.length;
  const C = new Array(d).fill(1);
  const s = sigma;
  let state = seed;
  const randn = () => {
    // 简化 Box-Muller
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const u1 = state / 0x7fffffff || 1e-9;
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const u2 = state / 0x7fffffff || 1e-9;
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  let iterations = 0;
  let converged = false;
  const weights = Array.from({ length: mu }, (_, i) => Math.log(mu + 0.5) - Math.log(i + 1));
  const wsum = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < mu; i++) weights[i]! /= wsum;
  for (let gen = 1; gen <= maxIter; gen++) {
    const samples: Array<{ z: number[]; x: number[]; fit: number }> = [];
    for (let k = 0; k < lambda; k++) {
      const z = Array.from({ length: d }, (_, j) => randn() * Math.sqrt(C[j]!));
      const x = mean.map((m, j) => m + s * z[j]!);
      samples.push({ z, x, fit: f(x) });
    }
    samples.sort((a, b) => a.fit - b.fit);
    const parents = samples.slice(0, mu);
    const newMean = new Array(d).fill(0);
    for (let j = 0; j < d; j++) {
      for (let i = 0; i < mu; i++) newMean[j]! += weights[i]! * parents[i]!.x[j]!;
    }
    const before = f(mean);
    for (let j = 0; j < d; j++) mean[j] = newMean[j]!;
    const after = f(mean);
    // 简化方差更新
    for (let j = 0; j < d; j++) {
      let acc = 0;
      for (let i = 0; i < mu; i++) acc += weights[i]! * parents[i]!.z[j]! * parents[i]!.z[j]!;
      C[j] = 0.9 * C[j]! + 0.1 * acc;
    }
    hooks.onGen?.(gen, [...mean], s);
    iterations = gen;
    if (Math.abs(before - after) < tol) {
      converged = true;
      break;
    }
  }
  return { params: mean, value: f(mean), iterations, converged };
}
/** 演示目标 f(x,y) = (x-3)^2 + (y+1)^2，最优解 (3,-1)。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}
/** 演示梯度 ∇f = [2(x-3), 2(y+1)]。 */
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}
