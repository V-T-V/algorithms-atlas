// =============================================================================
// 粒子滤波（Bootstrap SMC）· 纯算法实现
// 状态为标量（演示 1D 跟踪）。含系统重采样（systematic resampling）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface Particle {
  x: number;
  w: number;
}

export interface PFStep {
  k: number;
  estimate: number;
  ess: number; // effective sample size
  measurement: number;
}

export interface PFHooks {
  onStep?: (step: PFStep, particles: Particle[]) => void;
}

export interface PFOptions {
  /** 粒子数。默认 200。 */
  nParticles?: number;
  /** 过程噪声标准差。默认 0.5。 */
  processStd?: number;
  /** 观测噪声标准差。默认 1。 */
  measurementStd?: number;
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

/** Box-Muller 正态。 */
export function gaussian(rng: () => number, mean: number, std: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return mean + std * (Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
}

/** 系统重采样。 */
export function systematicResample(particles: Particle[], rng: () => number): Particle[] {
  const n = particles.length;
  const positions = Array.from({ length: n }, (_, i) => (i + rng()) / n);
  const cumsum = new Array<number>(n);
  let s = 0;
  const sortedW = particles.map((p) => p.w);
  for (let i = 0; i < n; i++) {
    s += sortedW[i]!;
    cumsum[i] = s;
  }
  const out: Particle[] = [];
  let i = 0;
  for (let j = 0; j < n; j++) {
    while (i < n - 1 && positions[j]! > cumsum[i]!) i++;
    out.push({ x: particles[i]!.x, w: 1 / n });
  }
  return out;
}

/**
 * 粒子滤波（1D 状态，演示模型：x_k = x_{k−1} + 噪声，观测 z_k = x_k + 噪声）。
 *
 * @param observations 观测序列
 * @param initialState 粒子初始分布的均值
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function particleFilter(
  observations: number[],
  initialState: number,
  options: PFOptions = {},
  hooks: PFHooks = {},
): { estimates: number[]; particles: Particle[] } {
  const nParticles = options.nParticles ?? 200;
  const processStd = options.processStd ?? 0.5;
  const measurementStd = options.measurementStd ?? 1;
  const rng = options.rng ?? mulberry32(options.seed ?? 42);

  // 初始化粒子
  let particles: Particle[] = Array.from({ length: nParticles }, () => ({
    x: gaussian(rng, initialState, 1),
    w: 1 / nParticles,
  }));

  const estimates: number[] = [];

  for (let k = 0; k < observations.length; k++) {
    // 1. 预测
    particles = particles.map((p) => ({ x: p.x + gaussian(rng, 0, processStd), w: p.w }));

    // 2. 加权（观测似然：高斯）
    const z = observations[k]!;
    for (const p of particles) {
      const diff = z - p.x;
      const ll = Math.exp(-(diff * diff) / (2 * measurementStd * measurementStd));
      p.w = ll;
    }
    // 归一化
    let wsum = 0;
    for (const p of particles) wsum += p.w;
    if (wsum <= 0) {
      // 全部似然为 0 → 重置均匀
      for (const p of particles) p.w = 1 / nParticles;
    } else {
      for (const p of particles) p.w /= wsum;
    }

    // 3. 估计（加权均值）
    let est = 0;
    for (const p of particles) est += p.x * p.w;

    // ESS
    let sqSum = 0;
    for (const p of particles) sqSum += p.w * p.w;
    const ess = sqSum > 0 ? 1 / sqSum : nParticles;

    // 4. 重采样（ESS 退化时）
    if (ess < nParticles / 2) {
      particles = systematicResample(particles, rng);
    }

    estimates.push(est);
    hooks.onStep?.(
      { k: k + 1, estimate: est, ess, measurement: z },
      particles.map((p) => ({ ...p })),
    );
  }

  return { estimates, particles };
}

/** 演示：跟踪线性增长的真值，带噪观测。 */
export function demoData(): { truth: number[]; observations: number[]; initialState: number } {
  const truth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const observations = [0.4, 0.9, 2.3, 2.8, 4.2, 4.9, 6.1, 7.2, 7.8, 9.3];
  return { truth, observations, initialState: 0 };
}
