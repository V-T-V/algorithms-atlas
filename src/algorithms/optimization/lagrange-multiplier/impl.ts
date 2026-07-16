// =============================================================================
// 拉格朗日乘子法 · 纯算法实现
// 等式约束 min f(x) s.t. g(x)=0；构造 L = f + λ·g，用牛顿法联立解驻点方程。
// 用户需提供 f、g 及其梯度（数值差分默认可用，但精确梯度更稳）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface LagrangeResult {
  /** 最优 x。 */
  x: number[];
  /** 拉格朗日乘子。 */
  lambda: number[];
  /** 最优目标值。 */
  value: number;
  /** 残差（约束违反 + 驻点误差）。 */
  residual: number;
  iterations: number;
  converged: boolean;
}

export interface LagrangeHooks {
  onIteration?: (iter: number, x: number[], lambda: number[], residual: number) => void;
}

export interface LagrangeOptions {
  maxIterations?: number;
  tolerance?: number;
  /** 初始 λ。 */
  initLambda?: number[];
}

/** 中心差分数值梯度。 */
function numGrad(f: (x: number[]) => number, x: number[], h = 1e-6): number[] {
  const n = x.length;
  const g = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const xp = [...x];
    xp[i]! += h;
    const xm = [...x];
    xm[i]! -= h;
    g[i] = (f(xp) - f(xm)) / (2 * h);
  }
  return g;
}

/** 求 N×N 矩阵逆（高斯-约旦，加正则）。 */
function matInverse(m: number[][], reg = 1e-9): number[][] {
  const n = m.length;
  const a = m.map((row) => row.map((v) => v));
  for (let i = 0; i < n; i++) a[i]![i]! += reg;
  const aug = a.map((row, i) => {
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

/**
 * 拉格朗日乘子法（牛顿法解 KKT 系统）。
 *
 * @param f 目标函数
 * @param constraints 等式约束 g_i(x) = 0
 * @param x0 初始 x
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function lagrangeMultiplier(
  f: (x: number[]) => number,
  constraints: Array<(x: number[]) => number>,
  x0: number[],
  options: LagrangeOptions = {},
  hooks: LagrangeHooks = {},
): LagrangeResult {
  const maxIter = options.maxIterations ?? 100;
  const tol = options.tolerance ?? 1e-8;
  const m = constraints.length;
  const x = [...x0];
  const lambda = options.initLambda ? [...options.initLambda] : new Array<number>(m).fill(0);

  let iterations = 0;
  let converged = false;
  let residual = Infinity;

  for (; iterations < maxIter; iterations++) {
    // ∇_x L = ∇f + Σ λ_i ∇g_i
    const L = (xx: number[]): number => {
      let s = f(xx);
      for (let i = 0; i < m; i++) s += lambda[i]! * constraints[i]!(xx);
      return s;
    };
    const gradL = numGrad(L, x);
    const gVal = constraints.map((c) => c(x));

    residual = Math.sqrt(
      gradL.reduce((s, v) => s + v * v, 0) + gVal.reduce((s, v) => s + v * v, 0),
    );
    hooks.onIteration?.(iterations, [...x], [...lambda], residual);

    if (residual < tol) {
      converged = true;
      iterations++;
      break;
    }

    // 牛顿步：构造雅可比 J（梯度的差分）并解 J·Δ = −r
    const N = x.length + m;
    const J: number[][] = Array.from({ length: N }, () => new Array<number>(N).fill(0));
    const r = [...gradL, ...gVal];
    // 对每个残差分量对 (x_j, λ_k) 求数值差分
    const h = 1e-6;
    for (let a = 0; a < N; a++) {
      // 偏 x_j（扰动 x）
      if (a < x.length) {
        const xp = [...x];
        xp[a]! += h;
        const gradLp = numGrad(
          (xx: number[]) => f(xx) + lambda.reduce((s, la, i) => s + la * constraints[i]!(xx), 0),
          xp,
        );
        for (let b = 0; b < x.length; b++) J[b]![a]! = (gradLp[b]! - gradL[b]!) / h;
        const gValp = constraints.map((c) => c(xp));
        for (let b = 0; b < m; b++) J[x.length + b]![a]! = (gValp[b]! - gVal[b]!) / h;
      } else {
        // 偏 λ_k：驻点方程 ∇_x L 对 λ_k 的导数 = ∇g_k；约束方程对 λ_k 导数 = 0
        const k = a - x.length;
        const gk = numGrad(constraints[k]!, x);
        for (let b = 0; b < x.length; b++) J[b]![a]! = gk[b]!;
        // 约束方程对 λ 导数为 0
      }
    }

    // 解 J·Δ = −r
    const negR = r.map((v) => -v);
    const Jinv = matInverse(J);
    const delta = Jinv.map((row) => row.reduce((s, v, i) => s + v * negR[i]!, 0));

    // 更新
    for (let i = 0; i < x.length; i++) x[i]! += delta[i]!;
    for (let k = 0; k < m; k++) lambda[k]! += delta[x.length + k]!;
  }

  return {
    x,
    lambda,
    value: f(x),
    residual,
    iterations,
    converged: converged || iterations >= maxIter,
  };
}

/** 演示：min x²+y² s.t. x+y=2 → 最优 (1,1)，λ=−1。 */
export function demoProblem(): {
  f: (x: number[]) => number;
  constraints: Array<(x: number[]) => number>;
  x0: number[];
  expect: number[];
} {
  return {
    f: (x) => x[0]! ** 2 + x[1]! ** 2,
    constraints: [(x) => x[0]! + x[1]! - 2],
    x0: [0, 0],
    expect: [1, 1],
  };
}
