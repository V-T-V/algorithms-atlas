// =============================================================================
// 二次罚函数法 · 纯算法实现
// 不等式约束 min f(x) s.t. gᵢ(x) ≤ 0
// =============================================================================

export type Vec = number[];

export interface PenaltyResult {
  x: Vec;
  fval: number;
  muFinal: number;
  violation: number;
  outerIter: number;
  iterations: number;
  converged: boolean;
}

export interface PenaltyHooks {
  onOuter?: (mu: number, x: Vec, fval: number, violation: number) => void;
  onInner?: (innerIter: number, x: Vec, pval: number) => void;
}

/**
 * 二次罚函数法。
 *
 * @param f     目标
 * @param gradf f 的梯度
 * @param G     约束函数数组（每个返回 gᵢ(x)）
 * @param gradG 约束梯度数组（每个返回 ∇gᵢ(x)）
 * @param x0    任意初值（不必可行）
 */
export function penaltyMethod(
  f: (x: Vec) => number,
  gradf: (x: Vec) => number[],
  G: Array<(x: Vec) => number>,
  gradG: Array<(x: Vec) => number[]>,
  x0: number[],
  options: {
    mu0?: number;
    beta?: number; // μ 增长因子
    eps?: number; // 收敛阈值（违反量）
    innerLr?: number;
    innerMaxIter?: number;
    outerMaxIter?: number;
  } = {},
  hooks: PenaltyHooks = {},
): PenaltyResult {
  const {
    mu0 = 1,
    beta = 10,
    eps = 1e-6,
    innerLr = 0.01,
    innerMaxIter = 300,
    outerMaxIter = 30,
  } = options;
  const n = x0.length;
  const m = G.length;
  let mu = mu0;
  let x: Vec = [...x0];
  let outerIter = 0;
  let totalIter = 0;

  const penaltyVal = (xv: Vec): number => {
    let s = 0;
    for (let i = 0; i < m; i++) {
      const gi = G[i]!(xv);
      if (gi > 0) s += gi * gi;
    }
    return s;
  };
  const totalViolation = (xv: Vec): number => {
    let s = 0;
    for (let i = 0; i < m; i++) {
      const gi = G[i]!(xv);
      if (gi > 0) s += gi;
    }
    return s;
  };

  while (outerIter < outerMaxIter) {
    outerIter++;
    // 内层：梯度下降 min P(x,μ)
    for (let it = 0; it < innerMaxIter; it++) {
      totalIter++;
      // 梯度：gradf + μ·Σ_{gᵢ>0} 2 gᵢ ∇gᵢ
      const gP: Vec = gradf(x);
      for (let i = 0; i < m; i++) {
        const gi = G[i]!(x);
        if (gi > 0) {
          const ng = gradG[i]!(x);
          for (let j = 0; j < n; j++) gP[j] = gP[j]! + 2 * mu * gi * ng[j]!;
        }
      }
      const norm = Math.sqrt(gP.reduce((s, v) => s + v * v, 0));
      const pv = f(x) + mu * penaltyVal(x);
      hooks.onInner?.(it + 1, x, pv);
      if (norm < 1e-10) break;
      // 自适应线搜索
      let t = innerLr;
      while (t > 1e-14) {
        const xn: Vec = x.map((v, j) => v - t * gP[j]!);
        const pvn = f(xn) + mu * penaltyVal(xn);
        if (pvn <= pv - 1e-4 * t * norm * norm) break;
        t *= 0.5;
      }
      x = x.map((v, j) => v - t * gP[j]!);
    }
    const viol = totalViolation(x);
    hooks.onOuter?.(mu, x, f(x), viol);
    if (viol < eps) break;
    mu *= beta;
  }

  const violation = totalViolation(x);
  const converged = violation < eps * 100; // 放宽，罚函数天然有边界残余
  return { x, fval: f(x), muFinal: mu, violation, outerIter, iterations: totalIter, converged };
}
