// 贝叶斯优化 EI · 实现
export interface BayesEiHooks {
  onIter?: (iter: number, sampledX: number, sampledY: number, best: number) => void;
}
export interface BayesEiResult {
  samples: Array<{ x: number; y: number }>;
  bestX: number;
  bestY: number;
  iterations: number;
}
export function optBayesEi(
  objective: (x: number) => number,
  opts: { xi?: number; maxIter?: number; candidates?: number[] } = {},
  hooks: BayesEiHooks = {},
): BayesEiResult {
  const { xi = 0.01, maxIter = 8, candidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] } = opts;
  const samples: Array<{ x: number; y: number }> = [];
  samples.push({ x: candidates[0]!, y: objective(candidates[0]!) });
  let bestY = samples[0]!.y;
  let bestX = samples[0]!.x;
  for (let it = 1; it < maxIter; it++) {
    let bestCand = candidates[1]!;
    let bestAcq = -Infinity;
    for (const x of candidates) {
      // 简化 GP：μ 为已采点 y 均值，σ 为到最近已采点距离
      const mu = samples.reduce((s, p) => s + p.y, 0) / samples.length;
      const sigma = Math.sqrt(Math.min(...samples.map((p) => Math.abs(p.x - x))) + 0.1);
      const improvement = mu - bestY - xi;
      // EI = (μ - f* - ξ) Φ(Z) + σ φ(Z)；这里用简化公式
      const Z = sigma > 0 ? improvement / sigma : 0;
      const cdf = 0.5 * (1 + Math.tanh(Z * 0.7979));
      const pdf = Math.exp((-Z * Z) / 2) / Math.sqrt(2 * Math.PI);
      const ei = improvement * cdf + sigma * pdf;
      if (ei > bestAcq) {
        bestAcq = ei;
        bestCand = x;
      }
    }
    const y = objective(bestCand);
    samples.push({ x: bestCand, y });
    if (y > bestY) {
      bestY = y;
      bestX = bestCand;
    }
    hooks.onIter?.(it, bestCand, y, bestY);
  }
  return { samples, bestX, bestY, iterations: maxIter };
}
export function demoObjective(x: number): number {
  return -((x - 7) ** 2) + 10;
}
export function demoFunc(p: number[]): number {
  return -demoObjective(p[0]!);
}
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 7)];
}
