// =============================================================================
// 二进制粒子群 Binary PSO · 纯算法实现
// 每个粒子是一个二进制位串，速度决定每位取 1 的概率（sigmoid）。
// 演示问题：One-Max（最大化 1 的个数）。
// =============================================================================

/** LCG 随机数生成器（固定种子保证可复现）。 */
export function makeLcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 4294967296;
  };
}

export interface BinaryPSOHooks {
  onIter?: (iter: number, bestFitness: number, avgFitness: number) => void;
}

export interface BPSOResult {
  bestPosition: number[];
  bestFitness: number;
  iterations: number;
}

/**
 * 二进制粒子群优化。
 * @param bits 位串长度
 * @param fitness 适应度函数（输入位串，返回数值，越大越好）
 * @param numParticles 粒子数
 * @param maxIter 最大迭代
 * @param w 惯性权重
 * @param c1 认知系数
 * @param c2 社会系数
 * @param rng 随机数生成器（固定种子可复现）
 */
export function binaryPSO(
  bits: number,
  fitness: (pos: number[]) => number,
  numParticles: number,
  maxIter: number,
  w: number,
  c1: number,
  c2: number,
  rng: () => number,
  hooks: BinaryPSOHooks = {},
): BPSOResult {
  // 初始化：每个粒子随机位串 + 速度 0
  const positions: number[][] = [];
  const velocities: number[][] = [];
  const pBest: number[][] = [];
  const pBestFit: number[] = [];
  let gBest: number[] = [];
  let gBestFit = -Infinity;

  for (let p = 0; p < numParticles; p++) {
    const pos: number[] = [];
    const vel: number[] = [];
    for (let b = 0; b < bits; b++) {
      pos.push(rng() < 0.5 ? 0 : 1);
      vel.push(0);
    }
    positions.push(pos);
    velocities.push(vel);
    const fit = fitness(pos);
    pBest.push([...pos]);
    pBestFit.push(fit);
    if (fit > gBestFit) {
      gBestFit = fit;
      gBest = [...pos];
    }
  }

  let lastIter = 0;
  for (let iter = 1; iter <= maxIter; iter++) {
    lastIter = iter;
    let iterBest = -Infinity;
    let sumFit = 0;
    for (let p = 0; p < numParticles; p++) {
      for (let b = 0; b < bits; b++) {
        const r1 = rng();
        const r2 = rng();
        // 速度更新（连续值）
        velocities[p]![b] =
          w * velocities[p]![b]! +
          c1 * r1 * (pBest[p]![b]! - positions[p]![b]!) +
          c2 * r2 * (gBest[b]! - positions[p]![b]!);
        // sigmoid 映射为取 1 的概率
        const prob = 1 / (1 + Math.exp(-velocities[p]![b]!));
        positions[p]![b] = rng() < prob ? 1 : 0;
      }
      const fit = fitness(positions[p]!);
      sumFit += fit;
      if (fit > pBestFit[p]!) {
        pBestFit[p] = fit;
        pBest[p] = [...positions[p]!];
      }
      if (fit > gBestFit) {
        gBestFit = fit;
        gBest = [...positions[p]!];
      }
      if (fit > iterBest) iterBest = fit;
    }
    hooks.onIter?.(iter, gBestFit, sumFit / numParticles);
    if (gBestFit >= bits) break; // One-Max 已达最优
  }

  return { bestPosition: gBest, bestFitness: gBestFit, iterations: lastIter };
}

/** One-Max 适应度：位串中 1 的个数。 */
export function oneMaxFitness(pos: number[]): number {
  return pos.reduce((s, b) => s + b, 0);
}
