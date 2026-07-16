// =============================================================================
// 增广拉格朗日法 · 纯算法实现
// 等式约束 min f(x) s.t. hᵢ(x) = 0
// =============================================================================

export type Vec = number[];

export interface ALResult {
  x: Vec;
  fval: number;
  lambda: Vec;
  muFinal: number;
  violation: number;
  outerIter: number;
  iterations: number;
  converged: boolean;
}

export interface ALHooks {
  onOuter?: (mu: number, lambda: Vec, x: Vec, fval: number, violation: number) => void;
  onInner?: (innerIter: number, x: Vec, lav: number) => void;
}

/**
 * 增广拉格朗日法（Hestenes–Powell）。
 *
 * @param f     目标
 * @param gradf f 的梯度
 * @param H     等式约束函数数组（每个返回 hᵢ(x)）
 * @param gradH 约束梯度数组（每个返回 ∇hᵢ(x)）
 * @param x0    任意初值
 * @param lambda0 乘子初值（默认 0）
 */
export function augmentedLagrangian(
  f: (x: Vec) => number,
  gradf: (x: Vec) => number[],
  H: Array<(x: Vec) => number>,
  gradH: Array<(x: Vec) => number[]>,
  x0: number[],
  options: {
    mu0?: number;
    beta?: number; // μ 增长因子
    eps?: number; // 收敛阈值
    innerLr?: number;
    innerMaxIter?: number;
    outerMaxIter?: number;
    lambdaMax?: number;
  } = {},
  hooks: ALHooks = {},
  lambda0?: number[],
): ALResult {
  const {
    mu0 = 10,
    beta = 5,
    eps = 1e-7,
    innerLr = 0.02,
    innerMaxIter = 200,
    outerMaxIter = 40,
    lambdaMax = 1e6,
  } = options;
  const n = x0.length;
  const m = H.length;
  let mu = mu0;
  let lambda: Vec = lambda0 ? [...lambda0] : new Array(m).fill(0);
  let x: Vec = [...x0];
  let outerIter = 0;
  let totalIter = 0;

  const hVec = (xv: Vec): Vec => H.map((fn) => fn(xv));
  const violation = (xv: Vec): number => {
    const hv = hVec(xv);
    return Math.sqrt(hv.reduce((s, v) => s + v * v, 0));
  };

  while (outerIter < outerMaxIter) {
    outerIter++;
    // 内层：min_x L_A(x, λ, μ) = f - λᵀh + (μ/2)‖h‖²
    for (let it = 0; it < innerMaxIter; it++) {
      totalIter++;
      const hv = hVec(x);
      const gL: Vec = gradf(x);
      for (let i = 0; i < m; i++) {
        const ng = gradH[i]!(x);
        for (let j = 0; j < n; j++) {
          // ∂/∂xⱼ [ -λᵢhᵢ + (μ/2)hᵢ² ] = (-λᵢ + μ hᵢ)·∂hᵢ/∂xⱼ
          gL[j] = gL[j]! + (-lambda[i]! + mu * hv[i]!) * ng[j]!;
        }
      }
      const norm = Math.sqrt(gL.reduce((s, v) => s + v * v, 0));
      // 当前增广拉格朗日值
      const lav =
        f(x) -
        hv.reduce((s, v, i) => s + lambda[i]! * v, 0) +
        (mu / 2) * hv.reduce((s, v) => s + v * v, 0);
      hooks.onInner?.(it + 1, x, lav);
      if (norm < 1e-10) break;
      let t = innerLr;
      while (t > 1e-15) {
        const xn: Vec = x.map((v, j) => v - t * gL[j]!);
        const hv2 = hVec(xn);
        const lav2 =
          f(xn) -
          hv2.reduce((s, v, i) => s + lambda[i]! * v, 0) +
          (mu / 2) * hv2.reduce((s, v) => s + v * v, 0);
        if (lav2 <= lav - 1e-4 * t * norm * norm) break;
        t *= 0.5;
      }
      x = x.map((v, j) => v - t * gL[j]!);
    }

    // 外层：乘子更新 λ ← λ - μ·h(x)，违反大则增大 μ
    const hv = hVec(x);
    const viol = Math.sqrt(hv.reduce((s, v) => s + v * v, 0));
    hooks.onOuter?.(mu, lambda, x, f(x), viol);
    if (viol < eps) break;
    lambda = lambda.map((l, i) => Math.max(-lambdaMax, Math.min(lambdaMax, l - mu * hv[i]!)));
    if (viol > 1e-2) mu *= beta; // 仅在违反仍大时增大
  }

  const v = violation(x);
  const converged = v < eps * 10;
  return {
    x,
    fval: f(x),
    lambda,
    muFinal: mu,
    violation: v,
    outerIter,
    iterations: totalIter,
    converged,
  };
}
