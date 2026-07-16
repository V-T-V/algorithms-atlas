// =============================================================================
// 贝叶斯优化 · 纯算法实现
// 一维高斯过程（平方指数核）+ 期望改进（EI）采集函数。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 观测点。 */
export interface Observation {
  x: number;
  fx: number;
}

export interface BOIteration {
  /** 本步选取的评估点。 */
  xNext: number;
  /** 本步 EI。 */
  eiNext: number;
  /** 当前 GP 在该点的预测均值与标准差。 */
  mean: number;
  std: number;
}

export interface BOResult {
  /** 所有观测点（含初始）。 */
  observations: Observation[];
  /** 找到的最优点。 */
  best: Observation;
  /** 每步记录。 */
  history: BOIteration[];
}

export interface BOHooks {
  onStep?: (step: number, iter: BOIteration, observations: Observation[]) => void;
}

export interface BOOptions {
  /** 评估次数（含初始）。默认 10。 */
  nEvals?: number;
  /** 搜索域。默认 [0,1]。 */
  bounds?: [number, number];
  /** 核长度尺度 ℓ。默认 0.2。 */
  lengthScale?: number;
  /** 信号方差 σ_f²。默认 1。 */
  signalVar?: number;
  /** 噪声方差 σ_n²。默认 1e-6。 */
  noiseVar?: number;
  /** EI 探索候选数（网格采样）。默认 100。 */
  nCandidates?: number;
}

/** 标准正态 CDF Φ。 */
export function normalCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

/** 标准正态 PDF φ。 */
export function normalPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/** erf 近似（Abramowitz-Stegun 7.1.26）。 */
export function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x >= 0 ? 1 : -1;
  const ax = Math.abs(x);
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

/** 平方指数核 k(x,x') = σ_f² exp(−(x−x')²/(2ℓ²))。 */
function seKernel(a: number, b: number, lengthScale: number, signalVar: number): number {
  return signalVar * Math.exp(-((a - b) ** 2) / (2 * lengthScale * lengthScale));
}

/** 用当前观测拟合 GP，返回预测函数（μ, σ²）。 */
export function fitGP(
  obs: Observation[],
  options: { lengthScale: number; signalVar: number; noiseVar: number },
): (x: number) => { mean: number; variance: number } {
  const { lengthScale, signalVar, noiseVar } = options;
  const n = obs.length;
  if (n === 0) {
    return (_x) => ({ mean: 0, variance: signalVar });
  }
  // 构造 K (n×n) 与 K*
  const K: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => seKernel(obs[i]!.x, obs[j]!.x, lengthScale, signalVar)),
  );
  for (let i = 0; i < n; i++) K[i]![i]! += noiseVar;
  const Kinv = matInverse(K);
  const y = obs.map((o) => o.fx);

  return (x: number): { mean: number; variance: number } => {
    const ks = obs.map((o) => seKernel(x, o.x, lengthScale, signalVar));
    const kss = seKernel(x, x, lengthScale, signalVar) + noiseVar;
    // μ = ksᵀ K⁻¹ y
    let mean = 0;
    for (let i = 0; i < n; i++) {
      let row = 0;
      for (let j = 0; j < n; j++) row += Kinv[i]![j]! * y[j]!;
      mean += ks[i]! * row;
    }
    // σ² = kss − ksᵀ K⁻¹ ks
    let varRed = 0;
    for (let i = 0; i < n; i++) {
      let row = 0;
      for (let j = 0; j < n; j++) row += Kinv[i]![j]! * ks[j]!;
      varRed += ks[i]! * row;
    }
    const variance = Math.max(kss - varRed, 0);
    return { mean, variance };
  };
}

/** 矩阵求逆（高斯-约旦）。 */
function matInverse(m: number[][]): number[][] {
  const n = m.length;
  const aug = m.map((row, i) => {
    const id = new Array<number>(n).fill(0);
    id[i] = 1;
    return [...row, ...id];
  });
  for (let col = 0; col < n; col++) {
    let pivot = col;
    let maxAbs = Math.abs(aug[col]![col]!);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r]![col]!) > maxAbs) {
        maxAbs = Math.abs(aug[r]![col]!);
        pivot = r;
      }
    }
    [aug[col], aug[pivot]] = [aug[pivot]!, aug[col]!];
    const pv = aug[col]![col]!;
    if (Math.abs(pv) < 1e-14) throw new Error('singular');
    for (let j = 0; j < 2 * n; j++) aug[col]![j]! /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r]![col]!;
      for (let j = 0; j < 2 * n; j++) aug[r]![j]! -= factor * aug[col]![j]!;
    }
  }
  return aug.map((row) => row.slice(n));
}

/** 期望改进 EI（最小化 f，f* 为当前最优值）。 */
export function expectedImprovement(mean: number, std: number, fStar: number, xi = 0.01): number {
  if (std < 1e-12) return 0;
  const delta = fStar - mean - xi;
  const z = delta / std;
  return Math.max(0, delta * normalCdf(z) + std * normalPdf(z));
}

/** mulberry32 伪随机。 */
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

/**
 * 贝叶斯优化（1D，最小化目标）。
 *
 * @param f 目标函数
 * @param initialObs 初始观测
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function bayesianOptimization(
  f: (x: number) => number,
  initialObs: Observation[],
  options: BOOptions = {},
  hooks: BOHooks = {},
): BOResult {
  const nEvals = options.nEvals ?? 10;
  const bounds = options.bounds ?? [0, 1];
  const lengthScale = options.lengthScale ?? 0.2;
  const signalVar = options.signalVar ?? 1;
  const noiseVar = options.noiseVar ?? 1e-6;
  const nCandidates = options.nCandidates ?? 100;

  const observations = initialObs.map((o) => ({ ...o }));
  const history: BOIteration[] = [];

  for (let step = 0; step < nEvals; step++) {
    const predict = fitGP(observations, { lengthScale, signalVar, noiseVar });
    const fStar = Math.min(...observations.map((o) => o.fx));

    // 在网格候选上最大化 EI
    let bestX = bounds[0]!;
    let bestEI = -Infinity;
    let bestMean = 0;
    let bestStd = 0;
    for (let c = 0; c < nCandidates; c++) {
      const x = bounds[0]! + ((bounds[1]! - bounds[0]!) * c) / (nCandidates - 1);
      const { mean, variance } = predict(x);
      const std = Math.sqrt(variance);
      const ei = expectedImprovement(mean, std, fStar);
      if (ei > bestEI) {
        bestEI = ei;
        bestX = x;
        bestMean = mean;
        bestStd = std;
      }
    }
    const iter: BOIteration = { xNext: bestX, eiNext: bestEI, mean: bestMean, std: bestStd };
    history.push(iter);
    hooks.onStep?.(
      step,
      iter,
      observations.map((o) => ({ ...o })),
    );

    // 评估并加入观测
    observations.push({ x: bestX, fx: f(bestX) });
  }

  let best = observations[0]!;
  for (const o of observations) if (o.fx < best.fx) best = o;

  return { observations, best, history };
}

/** 演示：f(x) = (x − 0.7)²，最优 x=0.7。 */
export function demoFunc(x: number): number {
  return (x - 0.7) ** 2;
}
