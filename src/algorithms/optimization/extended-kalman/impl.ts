// =============================================================================
// 扩展卡尔曼滤波（EKF）· 纯算法实现
// 非线性状态 f 与观测 h，用户提供函数与解析雅可比。
// 标量观测（m=1）简化。零 DOM 依赖，可独立单测。
// =============================================================================

export interface EKFState {
  mean: number[];
  cov: number[][];
}

export interface EKFStep {
  k: number;
  predictedMean: number[];
  updatedMean: number[];
  gain: number[];
  measurement: number;
  predictedMeasurement: number;
}

export interface EKFHooks {
  onStep?: (step: EKFStep) => void;
}

export interface EKFOptions {
  /** 非线性状态转移 f(x)。 */
  f: (x: number[]) => number[];
  /** f 的雅可比 ∂f/∂x。 */
  F: (x: number[]) => number[][];
  /** 非线性观测 h(x)。 */
  h: (x: number[]) => number;
  /** h 的雅可比（行向量 ∂h/∂x）。 */
  H: (x: number[]) => number[];
  Q: number[][];
  R: number;
  init: EKFState;
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
 * 扩展卡尔曼滤波（标量观测）。
 *
 * @param observations 观测序列 z_1..z_T
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function extendedKalmanFilter(
  observations: number[],
  options: EKFOptions,
  hooks: EKFHooks = {},
): EKFState[] {
  const { f, F, h, H, Q, R, init } = options;
  let mean = [...init.mean];
  let cov = init.cov.map((r) => [...r]);
  const states: EKFState[] = [];

  for (let k = 0; k < observations.length; k++) {
    // 预测
    const predMean = f(mean);
    const Fk = F(mean);
    const Ft = transpose(Fk);
    const predCov = matMul(matMul(Fk, cov), Ft);
    const n = mean.length;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) predCov[i]![j]! += Q[i]![j]!;

    // 更新
    const Hk = H(predMean);
    const SPredHt = predCov.map((row) => dot(row, Hk));
    const S = dot(Hk, SPredHt) + R;
    const K = SPredHt.map((v) => v / S);
    const z = observations[k]!;
    const zPred = h(predMean);
    const innov = z - zPred;
    const updatedMean = predMean.map((m, i) => m + K[i]! * innov);
    const updatedCov: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let val = predCov[i]![j]!;
        for (let t = 0; t < n; t++) val -= K[i]! * Hk[t]! * predCov[t]![j]!;
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

/** 演示：追踪带距离观测的 2D 位置。\n * 状态 [px, py, vx, vy]，观测为到原点距离（非线性）。 */
export function demoData(): {
  options: EKFOptions;
  truth: number[][];
  observations: number[];
} {
  // f: 匀速运动
  const f = (x: number[]): number[] => [x[0]! + x[2]!, x[1]! + x[3]!, x[2]!, x[3]!];
  const F = (_x: number[]): number[][] => [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  // h: 到原点距离 sqrt(px²+py²)
  const h = (x: number[]): number => Math.hypot(x[0]!, x[1]!);
  const H = (x: number[]): number[] => {
    const d = Math.max(Math.hypot(x[0]!, x[1]!), 1e-6);
    return [x[0]! / d, x[1]! / d, 0, 0];
  };
  const Q = [
    [0.1, 0, 0, 0],
    [0, 0.1, 0, 0],
    [0, 0, 0.1, 0],
    [0, 0, 0, 0.1],
  ];
  const R = 0.5;
  const init: EKFState = {
    mean: [0, 0, 1, 1],
    cov: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  };
  // 真值：每步 px+=1, py+=1
  const truth = Array.from({ length: 10 }, (_, i) => [i + 1, i + 1, 1, 1]);
  const observations = truth.map((p) => Math.hypot(p[0]!, p[1]!) + Math.sin(p[0]!) * 0.3);
  return { options: { f, F, h, H, Q, R, init }, truth, observations };
}
