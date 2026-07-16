// =============================================================================
// Viterbi 算法（最可能状态路径）· 纯算法实现
// =============================================================================

export interface HMM {
  A: number[][];
  B: number[][];
  pi: number[];
}

export interface ViterbiResult {
  /** 最可能状态序列（每个时刻的状态下标）。 */
  path: number[];
  /** 该路径的概率（对数空间，便于避免下溢）。 */
  logProb: number;
}

export interface ViterbiHooks {
  /** 每个时刻 t 的 δ 与最优前驱 ψ。 */
  onStep?: (t: number, delta: number[], psi: number[]) => void;
  /** 完成。 */
  onDone?: (result: ViterbiResult) => void;
}

/** 安全 log（0 → -∞）。 */
function logSafe(x: number): number {
  return x > 0 ? Math.log(x) : -Infinity;
}

/**
 * Viterbi 算法（对数空间）。
 * @param model HMM 参数
 * @param obs 观测序列（观测值下标数组）
 */
export function viterbi(
  model: HMM,
  obs: readonly number[],
  hooks: ViterbiHooks = {},
): ViterbiResult {
  const { A, B, pi } = model;
  const n = pi.length;
  const T = obs.length;
  if (T === 0) return { path: [], logProb: 0 };
  if (n === 0) return { path: [], logProb: -Infinity };

  // 对数参数预计算
  const logA = A.map((row) => row.map(logSafe));
  const logB = B.map((row) => row.map(logSafe));
  const logPi = pi.map(logSafe);

  // δ[t][i], ψ[t][i]
  const delta: number[][] = Array.from({ length: T }, () => new Array(n).fill(-Infinity));
  const psi: number[][] = Array.from({ length: T }, () => new Array(n).fill(0));

  // 初始化
  for (let i = 0; i < n; i++) {
    delta[0]![i] = logPi[i]! + logB[i]![obs[0]!]!;
    psi[0]![i] = 0;
  }
  hooks.onStep?.(0, [...delta[0]!], [...psi[0]!]);

  // 递推
  for (let t = 1; t < T; t++) {
    for (let j = 0; j < n; j++) {
      let bestVal = -Infinity;
      let bestArg = 0;
      for (let i = 0; i < n; i++) {
        const v = delta[t - 1]![i]! + logA[i]![j]!;
        if (v > bestVal) {
          bestVal = v;
          bestArg = i;
        }
      }
      delta[t]![j] = bestVal + logB[j]![obs[t]!]!;
      psi[t]![j] = bestArg;
    }
    hooks.onStep?.(t, [...delta[t]!], [...psi[t]!]);
  }

  // 终止
  let bestLast = 0;
  let bestLogProb = -Infinity;
  for (let i = 0; i < n; i++) {
    if (delta[T - 1]![i]! > bestLogProb) {
      bestLogProb = delta[T - 1]![i]!;
      bestLast = i;
    }
  }

  // 回溯
  const path = new Array(T).fill(0);
  path[T - 1] = bestLast;
  for (let t = T - 2; t >= 0; t--) {
    path[t] = psi[t + 1]![path[t + 1]!]!;
  }

  const result: ViterbiResult = { path, logProb: bestLogProb };
  hooks.onDone?.(result);
  return result;
}
