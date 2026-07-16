// =============================================================================
// t-SNE 降维（简化版）· 纯算法实现
// 高维高斯相似度 → 低维 t 分布相似度 → 梯度下降最小化 KL(P||Q)。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 高维数据点（任意维度）。 */
export type HighDimPoint = number[];

export interface TSneResult {
  /** 2D 嵌入坐标。 */
  embedding: Array<{ x: number; y: number }>;
  /** 最终 KL 散度。 */
  klDivergence: number;
  /** 实际迭代轮数。 */
  iterations: number;
}

export interface TSneHooks {
  onIteration?: (iter: number, embedding: Array<{ x: number; y: number }>, kl: number) => void;
}

export interface TSneOptions {
  /** 目标维度（固定 2）。默认 2。 */
  dims?: number;
  /** 高斯核带宽 σ（困惑度的简化替代）。默认由数据尺度估。 */
  perplexity?: number;
  /** 学习率。默认 100。 */
  learningRate?: number;
  /** 动量。默认 0.5（前期）/ 0.8（后期）。 */
  momentum?: number;
  /** 最大迭代轮数。默认 300。 */
  maxIterations?: number;
  /** 随机数发生器。 */
  rng?: () => number;
  /** 种子。默认 42。 */
  seed?: number;
}

/** mulberry32 伪随机数发生器（确定性）。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 高维欧氏距离平方。 */
function distSqHD(a: number[], b: number[]): number {
  let s = 0;
  for (let k = 0; k < a.length; k++) s += (a[k]! - b[k]!) ** 2;
  return s;
}

/**
 * t-SNE（简化版）。
 *
 * @param X 高维数据 n×D
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function tsne(
  X: HighDimPoint[],
  options: TSneOptions = {},
  hooks: TSneHooks = {},
): TSneResult {
  // 本实现固定输出 2D（用于可视化）；dims 选项仅作兼容占位
  const _dims = options.dims ?? 2;
  void _dims;
  const learningRate = options.learningRate ?? 50;
  const maxIterations = options.maxIterations ?? 300;
  const rng = options.rng ?? mulberry32(options.seed ?? 42);

  const n = X.length;
  if (n === 0) {
    return { embedding: [], klDivergence: 0, iterations: 0 };
  }

  // 自适应 σ：取数据平均最近邻距离
  let avgNN = 0;
  for (let i = 0; i < n; i++) {
    let minD = Infinity;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d = distSqHD(X[i]!, X[j]!);
      if (d < minD) minD = d;
    }
    avgNN += Math.sqrt(minD);
  }
  avgNN = avgNN / n || 1;
  const sigma2 = (options.perplexity ?? avgNN * avgNN) || 1;

  // 1. 高维相似度 P（对称化）
  const P: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  let sumPAll = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d2 = distSqHD(X[i]!, X[j]!);
      const p = Math.exp(-d2 / (2 * sigma2));
      P[i]![j]! = p;
      P[j]![i]! = p;
      sumPAll += 2 * p;
    }
  }
  if (sumPAll <= 0) sumPAll = 1;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) P[i]![j]! /= sumPAll;
  // 早期放大（early exaggeration）常数
  const alpha = 4;

  // 2. 随机初始化低维嵌入 y（小随机数）
  const y: number[][] = Array.from({ length: n }, () => [rng() * 1e-3, rng() * 1e-3]);
  const dy: number[][] = Array.from({ length: n }, () => [0, 0]);

  let lastKL = 0;
  let iter = 0;
  for (; iter < maxIterations; iter++) {
    const momentum = iter < maxIterations / 2 ? (options.momentum ?? 0.5) : 0.8;

    // 低维相似度 Q（t 分布，自由度 1）
    const Q: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    let sumQ = 0;
    const dist2 = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d2 = (y[i]![0]! - y[j]![0]!) ** 2 + (y[i]![1]! - y[j]![1]!) ** 2;
        const q = 1 / (1 + d2);
        dist2[i]![j]! = d2;
        dist2[j]![i]! = d2;
        Q[i]![j]! = q;
        Q[j]![i]! = q;
        sumQ += 2 * q;
      }
    }
    if (sumQ <= 0) sumQ = 1;
    let kl = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        Q[i]![j]! /= sumQ;
        const pij = P[i]![j]!;
        if (pij > 1e-12) kl += pij * Math.log(pij / Math.max(Q[i]![j]!, 1e-12));
      }
    }
    lastKL = kl;

    // 梯度：dy_i = 4 Σ_j (p_ij - q_ij)(y_i - y_j)
    let maxStep = 0;
    for (let i = 0; i < n; i++) {
      let gx = 0,
        gy = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const pq = alpha * P[i]![j]! - Q[i]![j]!;
        gx += pq * (y[i]![0]! - y[j]![0]!);
        gy += pq * (y[i]![1]! - y[j]![1]!);
      }
      dy[i]![0]! = momentum * dy[i]![0]! - learningRate * 4 * gx;
      dy[i]![1]! = momentum * dy[i]![1]! - learningRate * 4 * gy;
      const step = Math.hypot(dy[i]![0]!, dy[i]![1]!);
      if (step > maxStep) maxStep = step;
    }
    // 每步裁剪位移，防止发散
    const stepCap = 5;
    const cap = maxStep > stepCap ? stepCap / maxStep : 1;
    for (let i = 0; i < n; i++) {
      y[i]![0]! += dy[i]![0]! * cap;
      y[i]![1]! += dy[i]![1]! * cap;
    }

    const embedding = y.map((p) => ({ x: p[0]!, y: p[1]! }));
    hooks.onIteration?.(iter, embedding, kl);
  }

  return {
    embedding: y.map((p) => ({ x: p[0]!, y: p[1]! })),
    klDivergence: lastKL,
    iterations: iter,
  };
}
