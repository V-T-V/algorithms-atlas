// =============================================================================
// 对角 CMA-ES · 纯算法实现
// 只学协方差对角线（每维方差）+ 全局步长 CSA。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface DiagCMAResult {
  mean: number[];
  sigma: number;
  diagC: number[];
  value: number;
  generations: number;
  converged: boolean;
}

export interface DiagCMAHooks {
  onGeneration?: (gen: number, mean: number[], sigma: number, best: number) => void;
}

export interface DiagCMAOptions {
  /** 种群大小 λ。默认 4+3ln(n)。 */
  lambda?: number;
  /** 父代数 μ。默认 λ/2。 */
  mu?: number;
  /** 最大代数。默认 300。 */
  maxGenerations?: number;
  /** 收敛阈值（σ·max(c)）。默认 1e-8。 */
  tolerance?: number;
  /** 初始步长 σ。默认 0.5。 */
  initSigma?: number;
  /** 随机数发生器。 */
  rng?: () => number;
  /** 种子。默认 42。 */
  seed?: number;
}

/** mulberry32。 */
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

/** Box-Muller 生成标准正态（用两个 rng）。 */
function gaussian(rng: () => number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * 对角 CMA-ES（最小化 f）。
 *
 * @param f 目标函数
 * @param initMean 初始均值（n 维）
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function diagCMAES(
  f: (x: number[]) => number,
  initMean: number[],
  options: DiagCMAOptions = {},
  hooks: DiagCMAHooks = {},
): DiagCMAResult {
  const n = initMean.length;
  const lambda = options.lambda ?? Math.floor(4 + 3 * Math.log(n));
  const mu = options.mu ?? Math.floor(lambda / 2);
  const maxGenerations = options.maxGenerations ?? 300;
  const tolerance = options.tolerance ?? 1e-8;
  const rng = options.rng ?? mulberry32(options.seed ?? 42);

  // 重组权重（log 缩放，归一化）
  const weightsRaw: number[] = [];
  for (let i = 0; i < mu; i++) weightsRaw.push(Math.log(mu + 0.5) - Math.log(i + 1));
  const wSum = weightsRaw.reduce((s, w) => s + w, 0);
  const weights = weightsRaw.map((w) => w / wSum);
  const muEff = 1 / weights.reduce((s, w) => s + w * w, 0);

  // 策略参数
  const cSigma = (muEff + 2) / (n + muEff + 5);
  const dSigma = 1 + 2 * Math.max(0, Math.sqrt((muEff - 1) / (n + 1)) - 1) + cSigma;
  const cC = 4 / (n + 4); // 对角方差学习率
  const cOne = 2 / ((n + 1.3) ** 2 + muEff); // rank-one 学习率

  let mean = [...initMean];
  let sigma = options.initSigma ?? 0.5;
  const diagC = new Array<number>(n).fill(1);
  const pSigma = new Array<number>(n).fill(0);
  const pC = new Array<number>(n).fill(0);
  let bestValue = f(mean);

  let generations = 0;
  let converged = false;

  for (let gen = 1; gen <= maxGenerations; gen++) {
    generations = gen;
    // 1. 采样
    const pop: Array<{ x: number[]; fx: number }> = [];
    for (let k = 0; k < lambda; k++) {
      const x = mean.map((m, i) => m + sigma * Math.sqrt(diagC[i]!) * gaussian(rng));
      pop.push({ x, fx: f(x) });
    }
    pop.sort((a, b) => a.fx - b.fx);

    if (pop[0]!.fx < bestValue) bestValue = pop[0]!.fx;

    // 2. 加权重组均值
    const yw = new Array<number>(n).fill(0); // 加权均值（归一化）
    for (let i = 0; i < mu; i++) {
      for (let d = 0; d < n; d++) {
        const y = (pop[i]!.x[d]! - mean[d]!) / sigma;
        yw[d]! += weights[i]! * y;
      }
    }
    const newMean = mean.map((m, d) => m + sigma * yw[d]!);

    // 3. CSA 步长更新
    // p_sigma 更新（用 C^{-1/2} yw，对角：除以 sqrt(c_d)）
    const cInvSqrt = diagC.map((c) => 1 / Math.sqrt(c));
    for (let d = 0; d < n; d++) {
      pSigma[d]! =
        (1 - cSigma) * pSigma[d]! +
        Math.sqrt(cSigma * (2 - cSigma) * muEff) * cInvSqrt[d]! * yw[d]!;
    }
    const psNorm = Math.sqrt(pSigma.reduce((s, v) => s + v * v, 0));
    sigma = sigma * Math.exp((cSigma / dSigma) * (psNorm / Math.sqrt(n) - 1));
    sigma = Math.min(sigma, 1e10); // 防爆

    // 4. 对角方差更新（rank-one 风格）
    const hSigma =
      psNorm / Math.sqrt(1 - (1 - cSigma) ** (2 * gen)) < (1.4 + 2 / (n + 1)) * Math.sqrt(n)
        ? 1
        : 0;
    for (let d = 0; d < n; d++) {
      pC[d]! = (1 - cC) * pC[d]! + hSigma * Math.sqrt(cC * (2 - cC) * muEff) * yw[d]!;
      const one = (pC[d]! * pC[d]!) / (diagC[d]! + 1e-12);
      diagC[d]! = (1 - cOne - cC) * diagC[d]! + cOne * one + cC * (yw[d]! * yw[d]!);
      diagC[d]! = Math.max(diagC[d]!, 1e-20);
    }

    const meanMove = Math.sqrt(mean.reduce((s, m, d) => s + (m - newMean[d]!) ** 2, 0));
    mean = newMean;
    hooks.onGeneration?.(gen, [...mean], sigma, bestValue);

    // 数值保护：若出现 NaN/Inf 则终止
    if (!Number.isFinite(sigma) || mean.some((m) => !Number.isFinite(m))) {
      break;
    }

    // 收敛判定：步长尺度极小 且 均值几乎不动 且 最优值小
    const scale = sigma * Math.sqrt(Math.max(...diagC));
    if (scale < tolerance && meanMove < tolerance * 10 && bestValue < tolerance * 1e6) {
      converged = true;
      break;
    }
  }

  return {
    mean,
    sigma,
    diagC,
    value: bestValue,
    generations,
    converged: converged || generations >= maxGenerations,
  };
}

/** 演示：球面 f(x) = Σ(x_i − i)²。 */
export function demoFunc(x: number[]): number {
  let s = 0;
  for (let i = 0; i < x.length; i++) s += (x[i]! - i) ** 2;
  return s;
}
