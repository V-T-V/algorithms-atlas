// =============================================================================
// 卡尔曼滤波（线性高斯）· 纯算法实现
// 标量观测简化版（H 为行向量），状态为向量。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface KalmanState {
  /** 状态均值向量。 */
  mean: number[];
  /** 状态协方差矩阵（n×n）。 */
  cov: number[][];
}

export interface KalmanStep {
  /** 步号。 */
  k: number;
  /** 预测（先验）均值。 */
  predictedMean: number[];
  /** 更新（后验）均值。 */
  updatedMean: number[];
  /** 卡尔曼增益。 */
  gain: number[];
  /** 观测值。 */
  measurement: number;
  /** 该步先验估计的观测 Hx⁻。 */
  predictedMeasurement: number;
}

export interface KalmanHooks {
  onStep?: (step: KalmanStep) => void;
}

export interface KalmanOptions {
  /** 状态转移 F (n×n)。 */
  F: number[][];
  /** 观测矩阵 H（行向量，m=1）。 */
  H: number[];
  /** 过程噪声 Q (n×n)。 */
  Q: number[][];
  /** 观测噪声 R（标量，m=1）。 */
  R: number;
  /** 初始状态。 */
  init: KalmanState;
}

function matVec(m: number[][], v: number[]): number[] {
  return m.map((row) => row.reduce((s, mv, i) => s + mv * v[i]!, 0));
}

function matMul(a: number[][], b: number[][]): number[][] {
  const m = a.length;
  const k = b.length;
  const n = b[0]!.length;
  const c: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += a[i]![t]! * b[t]![j]!;
      c[i]![j] = s;
    }
  return c;
}

function transpose(m: number[][]): number[][] {
  const r = m.length;
  const c = m[0]!.length;
  const out: number[][] = Array.from({ length: c }, () => new Array<number>(r).fill(0));
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) out[j]![i]! = m[i]![j]!;
  return out;
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]! * b[i]!;
  return s;
}

/**
 * 在线卡尔曼滤波：逐个处理观测序列。
 *
 * @param observations 观测序列 z_1..z_T
 * @param options 配置
 * @param hooks 可选事件钩子
 * @returns 每步后验状态
 */
export function kalmanFilter(
  observations: number[],
  options: KalmanOptions,
  hooks: KalmanHooks = {},
): KalmanState[] {
  const { F, H, Q, R, init } = options;
  let mean = [...init.mean];
  let cov = init.cov.map((r) => [...r]);
  const Ft = transpose(F);
  const Hcol = H;
  const states: KalmanState[] = [];

  for (let k = 0; k < observations.length; k++) {
    // —— 预测 ——
    const predMean = matVec(F, mean);
    const predCov = matMul(matMul(F, cov), Ft);
    const n = mean.length;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) predCov[i]![j]! += Q[i]![j]!;

    // —— 更新（m=1）——
    const SPredHt = predCov.map((row) => dot(row, Hcol));
    const S = dot(Hcol, SPredHt) + R;
    const K = SPredHt.map((v) => v / S); // P⁻Hᵀ / S
    const z = observations[k]!;
    const zPred = dot(Hcol, predMean);
    const innov = z - zPred;
    const updatedMean = predMean.map((m, i) => m + K[i]! * innov);
    // P = (I − K H) P⁻
    const updatedCov: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let val = predCov[i]![j]!;
        for (let t = 0; t < n; t++) val -= K[i]! * Hcol[t]! * predCov[t]![j]!;
        updatedCov[i]![j] = val;
      }
    }

    mean = updatedMean;
    cov = updatedCov;
    states.push({ mean: [...mean], cov: cov.map((r) => [...r]) });
    hooks.onStep?.({
      k: k + 1,
      predictedMean: [...predMean],
      updatedMean: [...mean],
      gain: [...K],
      measurement: z,
      predictedMeasurement: zPred,
    });
  }

  return states;
}

/** 演示：追踪匀速直线运动（带噪位置观测）。 */
export function demoData(): {
  F: number[][];
  H: number[];
  Q: number[][];
  R: number;
  init: KalmanState;
  truth: number[];
  observations: number[];
} {
  const F = [
    [1, 1],
    [0, 1],
  ];
  const H = [1, 0];
  const Q = [
    [0.01, 0],
    [0, 0.01],
  ];
  const R = 1;
  const init: KalmanState = {
    mean: [0, 1],
    cov: [
      [1, 0],
      [0, 1],
    ],
  };
  const truth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const observations = [0.5, 0.6, 2.4, 2.5, 4.5, 4.4, 6.5, 6.6, 8.4, 9.5];
  return { F, H, Q, R, init, truth, observations };
}
