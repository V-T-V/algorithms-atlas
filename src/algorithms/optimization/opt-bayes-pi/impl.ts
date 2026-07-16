// 贝叶斯优化 PI · 实现
export interface BayesPiHooks {
  onIter?: (iter: number, sampledX: number, sampledY: number, best: number) => void;
}
export interface BayesPiResult {
  samples: Array<{ x: number; y: number }>;
  bestX: number;
  bestY: number;
  iterations: number;
}
export function optBayesPi(
  objective: (x: number) => number,
  opts: { xi?: number; maxIter?: number; candidates?: number[] } = {},
  hooks: BayesPiHooks = {},
): BayesPiResult {
  const { xi = 0.01, maxIter = 8, candidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] } = opts;
  const samples: Array<{ x: number; y: number }> = [];
  samples.push({ x: candidates[0]!, y: objective(candidates[0]!) });
  let bestY = samples[0]!.y;
  let bestX = samples[0]!.x;
  for (let it = 1; it < maxIter; it++) {
    let bestCand = candidates[1]!;
    let bestAcq = -Infinity;
    for (const x of candidates) {
      const mu = samples.reduce((s, p) => s + p.y, 0) / samples.length;
      const sigma = Math.sqrt(Math.min(...samples.map((p) => Math.abs(p.x - x))) + 0.1);
      const Z = sigma > 0 ? (mu - bestY - xi) / sigma : 0;
      // PI = Φ(Z)
      const pi = 0.5 * (1 + Math.tanh(Z * 0.7979));
      if (pi > bestAcq) {
        bestAcq = pi;
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
