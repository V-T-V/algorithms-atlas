// =============================================================================
// 幂迭代求特征值（Power Iteration）· 纯算法实现（零 DOM 依赖，可独立单测）
// 求方阵的**占优特征值**（绝对值最大的特征值）及其对应特征向量。
// =============================================================================

/** 一轮迭代的信息。 */
export interface PowerIterStep {
  iter: number;
  /** 当前 Rayleigh 商（特征值估计）。 */
  eigenvalue: number;
  /** 当前特征向量估计（已归一化）。 */
  vector: number[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PowerIterHooks {
  onStep?: (step: PowerIterStep) => void;
}

/** 幂迭代返回结果。 */
export interface PowerIterResult {
  /** 占优特征值估计。 */
  eigenvalue: number;
  /** 对应特征向量估计（单位向量）。 */
  vector: number[];
  iterations: number;
  converged: boolean;
  steps: PowerIterStep[];
}

/**
 * 幂迭代求方阵 A 的**占优特征值** λ₁（|λ₁| 最大）与对应特征向量。
 *
 * 迭代：
 * 1. 取初始向量 b₀（非零）
 * 2. `b_{k+1} = A·b_k / ‖A·b_k‖`（归一化以防溢出）
 * 3. 特征值估计（Rayleigh 商）：`λ ≈ bᵀ·A·b / (bᵀ·b)`（b 已归一化时分母为 1）
 *
 * 直观理解：反复左乘 A 会放大最大特征值方向上的分量，最终 b 收敛到该方向。
 *
 * 收敛速度取决于**特征值间隔比** `|λ₂| / |λ₁|`：比值越小，收敛越快；若存在
 * 绝对值相近的特征值（如 ±a），可能不收敛或振荡。
 *
 * - 对 `[[2,0],[0,1]]`，占优特征值 = 2，特征向量 = (±1, 0)
 *
 * 时间复杂度 `O(k·n²)`（每轮一次矩阵-向量乘），空间 `O(n)`。
 *
 * @param A 方阵
 * @param options 初值、容差、最大迭代数
 * @param hooks 可选的事件钩子
 */
export function powerIter(
  A: readonly (readonly number[])[],
  options: { v0?: number[]; tol?: number; maxIter?: number } = {},
  hooks: PowerIterHooks = {},
): PowerIterResult {
  const n = A.length;
  const { tol = 1e-10, maxIter = 1000 } = options;
  let v = options.v0 ? [...options.v0] : new Array(n).fill(0).map(() => Math.random() || 0.1);
  // 归一化初值
  v = normalize(v);
  const steps: PowerIterStep[] = [];

  const matVec = (x: number[]): number[] => {
    const y = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += A[i]![j]! * x[j]!;
      y[i] = s;
    }
    return y;
  };
  const dot = (a: number[], b: number[]): number => {
    let s = 0;
    for (let i = 0; i < n; i++) s += a[i]! * b[i]!;
    return s;
  };

  let eigenvalue = dot(v, matVec(v)); // bᵀ A b（b 归一化）
  for (let iter = 0; iter < maxIter; iter++) {
    const Av = matVec(v);
    const norm = Math.sqrt(dot(Av, Av));
    if (norm === 0 || !Number.isFinite(norm)) {
      return { eigenvalue, vector: v, iterations: iter, converged: false, steps };
    }
    const next = Av.map((c) => c / norm);
    const newLambda = dot(next, matVec(next));
    const step: PowerIterStep = { iter, eigenvalue: newLambda, vector: next };
    steps.push(step);
    hooks.onStep?.(step);
    if (Math.abs(newLambda - eigenvalue) <= tol * (1 + Math.abs(newLambda))) {
      eigenvalue = newLambda;
      return { eigenvalue, vector: next, iterations: iter + 1, converged: true, steps };
    }
    eigenvalue = newLambda;
    v = next;
  }
  return { eigenvalue, vector: v, iterations: maxIter, converged: false, steps };
}

const normalize = (v: number[]): number[] => {
  let s = 0;
  for (const x of v) s += x * x;
  const n = Math.sqrt(s) || 1;
  return v.map((x) => x / n);
};
