// 贝叶斯优化 UCB · 实现（候选网格 + 简化 GP 预测）
export interface BayesUcbHooks {
  onIter?: (iter: number, sampledX: number, sampledY: number, best: number) => void;
}
export interface BayesUcbResult {
  samples: Array<{ x: number; y: number }>;
  bestX: number;
  bestY: number;
  iterations: number;
}
export function optBayesUcb2(
  objective: (x: number) => number,
  opts: {
    kappa?: number;
    maxIter?: number;
    candidates?: number[];
    xMin?: number;
    xMax?: number;
  } = {},
  hooks: BayesUcbHooks = {},
): BayesUcbResult {
  const {
    kappa = 2.0,
    maxIter = 8,
    candidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    xMin = 0,
    xMax = 10,
  } = opts;
  const samples: Array<{ x: number; y: number }> = [];
  // 初始采样：取中点
  samples.push({
    x: candidates[Math.floor(candidates.length / 2)]!,
    y: objective(candidates[Math.floor(candidates.length / 2)]!),
  });
  let bestX = samples[0]!.x;
  let bestY = samples[0]!.y;
  for (let it = 1; it < maxIter; it++) {
    let bestCand = candidates[0]!;
    let bestAcq = -Infinity;
    for (const x of candidates) {
      // 简化预测：μ = 已采样均值，σ = 到最近已采样点的距离（越远越不确定）
      const mu = samples.reduce((s, p) => s + p.y, 0) / samples.length;
      const minDist = Math.min(...samples.map((p) => Math.abs(p.x - x)));
      const sigma = Math.sqrt(minDist + 0.1);
      const acq = mu + kappa * sigma;
      if (acq > bestAcq) {
        bestAcq = acq;
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
  // 归一化结果坐标到 [xMin,xMax] 视图（不影响算法）
  void xMin;
  void xMax;
  return { samples, bestX, bestY, iterations: maxIter };
}
// 演示：最大化 f(x) = -((x-7)^2) + 10（峰值在 x=7）
export function demoObjective(x: number): number {
  return -((x - 7) ** 2) + 10;
}
export function demoFunc(p: number[]): number {
  return -demoObjective(p[0]!);
}
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 7)];
}
