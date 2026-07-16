// =============================================================================
// 隐马尔可夫模型（前向/后向）· 纯算法实现
// =============================================================================

export interface HMM {
  /** 状态转移矩阵 A[i][j]：从状态 i 到 j。 */
  A: number[][];
  /** 发射矩阵 B[i][o]：状态 i 发射观测 o。 */
  B: number[][];
  /** 初始状态分布 π。 */
  pi: number[];
}

export interface HMMHooks {
  /** 前向第 t 步给出 α[t]。 */
  onForwardStep?: (t: number, alpha: number[]) => void;
  /** 后向第 t 步给出 β[t]。 */
  onBackwardStep?: (t: number, beta: number[]) => void;
  /** 完成。 */
  onDone?: (prob: number) => void;
}

/**
 * 前向算法：求 P(O|λ)。
 * @param model HMM 参数
 * @param obs 观测序列（观测值的下标数组）
 */
export function forward(model: HMM, obs: readonly number[], hooks: HMMHooks = {}): number {
  const { A, B, pi } = model;
  const n = pi.length; // 状态数
  const T = obs.length;
  if (T === 0) {
    hooks.onDone?.(1);
    return 1;
  }
  // α[t][i]
  let alpha = pi.map((p, i) => p * B[i]![obs[0]!]!);
  hooks.onForwardStep?.(0, [...alpha]);
  for (let t = 1; t < T; t++) {
    const next = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += alpha[i]! * A[i]![j]!;
      next[j] = s * B[j]![obs[t]!]!;
    }
    alpha = next;
    hooks.onForwardStep?.(t, [...alpha]);
  }
  const prob = alpha.reduce((acc, v) => acc + v, 0);
  hooks.onDone?.(prob);
  return prob;
}

/**
 * 后向算法：求 P(O|λ)（与前向结果一致，作交叉验证）。
 */
export function backward(model: HMM, obs: readonly number[], hooks: HMMHooks = {}): number {
  const { A, B, pi } = model;
  const n = pi.length;
  const T = obs.length;
  if (T === 0) {
    hooks.onDone?.(1);
    return 1;
  }
  // β[t][i]
  let beta = new Array(n).fill(1);
  hooks.onBackwardStep?.(T - 1, [...beta]);
  for (let t = T - 2; t >= 0; t--) {
    const prev = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += A[i]![j]! * B[j]![obs[t + 1]!]! * beta[j]!;
      prev[i] = s;
    }
    beta = prev;
    hooks.onBackwardStep?.(t, [...beta]);
  }
  const prob = pi.reduce((acc, p, i) => acc + p * B[i]![obs[0]!]! * beta[i]!, 0);
  hooks.onDone?.(prob);
  return prob;
}

/** 校验 HMM 参数合法性（每行概率和为 1）。 */
export function validateHMM(model: HMM): boolean {
  const { A, B, pi } = model;
  const n = pi.length;
  if (A.length !== n) return false;
  if (B.length !== n) return false;
  const sum = (arr: number[]): number => arr.reduce((s, x) => s + x, 0);
  if (Math.abs(sum(pi) - 1) > 1e-6) return false;
  for (let i = 0; i < n; i++) {
    if (A[i]!.length !== n) return false;
    if (Math.abs(sum(A[i]!) - 1) > 1e-6) return false;
    if (Math.abs(sum(B[i]!) - 1) > 1e-6) return false;
    for (const v of A[i]!) if (v < 0 || v > 1) return false;
    for (const v of B[i]!) if (v < 0 || v > 1) return false;
  }
  return true;
}
