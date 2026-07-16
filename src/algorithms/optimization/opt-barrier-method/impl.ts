// =============================================================================
// 障碍（内点）法 · 纯算法实现
// 不等式约束 min f(x) s.t. A x ≤ b（每行 aᵢᵀx ≤ bᵢ）
// =============================================================================

export type Vec = number[];
export type Mat = number[][];

export interface Constraint {
  A: Mat; // m × n
  b: Vec; // m
}

export interface BarrierResult {
  x: Vec;
  fval: number;
  muFinal: number;
  outerIter: number;
  iterations: number;
  converged: boolean;
}

export interface BarrierHooks {
  onOuter?: (mu: number, x: Vec, fval: number, slackMin: number) => void;
  onNewton?: (innerIter: number, x: Vec, gradNorm: number) => void;
}

const dot = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i]!, 0);

/** 解线性方程组 H·y = g（高斯消元，带部分主元） */
function solveLinear(H: Mat, g: Vec): Vec {
  const n = H.length;
  const M: Mat = H.map((row, i) => [...row, g[i]!]);
  for (let k = 0; k < n; k++) {
    // 主元
    let piv = k;
    for (let r = k + 1; r < n; r++) {
      if (Math.abs(M[r]![k]!) > Math.abs(M[piv]![k]!)) piv = r;
    }
    if (piv !== k) {
      const tmp = M[k]!;
      M[k] = M[piv]!;
      M[piv] = tmp;
    }
    const pk = M[k]![k]!;
    if (Math.abs(pk) < 1e-14) continue;
    for (let r = k + 1; r < n; r++) {
      const factor = M[r]![k]! / pk;
      for (let c = k; c <= n; c++) {
        M[r]![c] = M[r]![c]! - factor * M[k]![c]!;
      }
    }
  }
  const y: Vec = new Array(n).fill(0);
  for (let k = n - 1; k >= 0; k--) {
    let s = M[k]![n]!;
    for (let c = k + 1; c < n; c++) s -= M[k]![c]! * y[c]!;
    y[k] = s / (M[k]![k]! || 1e-14);
  }
  return y;
}

/**
 * 障碍（内点）法。
 *
 * @param f   目标函数
 * @param grad f 的梯度
 * @param hess f 的 Hessian（n×n）
 * @param con 不等式约束 {A, b}：A x ≤ b
 * @param x0  严格可行初始点（A x0 < b）
 */
export function barrierMethod(
  f: (x: Vec) => number,
  grad: (x: Vec) => number[],
  hess: (x: Vec) => number[][],
  con: Constraint,
  x0: number[],
  options: {
    mu0?: number;
    tau?: number; // μ 缩小因子
    eps?: number; // 收敛阈值 μ·m < eps
    newtonTol?: number;
    newtonMaxIter?: number;
    outerMaxIter?: number;
  } = {},
  hooks: BarrierHooks = {},
): BarrierResult {
  const {
    mu0 = 1,
    tau = 0.2,
    eps = 1e-8,
    newtonTol = 1e-10,
    newtonMaxIter = 50,
    outerMaxIter = 60,
  } = options;
  const { A, b } = con;
  const m = A.length;
  const n = x0.length;
  let mu = mu0;
  let x: Vec = [...x0];
  let outerIter = 0;
  let totalIter = 0;

  // 验证严格可行
  for (let i = 0; i < m; i++) {
    if (dot(A[i]!, x) >= b[i]!) {
      throw new Error(
        `barrierMethod: initial point not strictly feasible (constraint ${i} violated)`,
      );
    }
  }

  while (outerIter < outerMaxIter) {
    outerIter++;
    // 内层牛顿法：min_x B(x,μ)
    for (let it = 0; it < newtonMaxIter; it++) {
      totalIter++;
      // 障碍梯度：gB = grad(f) + μ·Σ aᵢ / (bᵢ - aᵢᵀx)
      const gB: Vec = grad(x);
      const HB: Mat = hess(x).map((r) => [...r]);
      for (let i = 0; i < m; i++) {
        const ai = A[i]!;
        const slack = b[i]! - dot(ai, x);
        const invS = 1 / slack;
        const invS2 = invS * invS;
        for (let j = 0; j < n; j++) {
          gB[j] = gB[j]! + mu * ai[j]! * invS;
          for (let k = 0; k < n; k++) {
            HB[j]![k] = HB[j]![k]! + mu * ai[j]! * ai[k]! * invS2;
          }
        }
      }
      const gradNorm = Math.sqrt(gB.reduce((s, v) => s + v * v, 0));
      hooks.onNewton?.(it + 1, x, gradNorm);
      if (gradNorm < newtonTol) break;

      // 牛顿步
      const dx = solveLinear(
        HB,
        gB.map((v) => -v),
      );
      // 回溯线搜索保持严格可行
      let t = 1;
      while (t > 1e-12) {
        const xn: Vec = x.map((v, j) => v + t * dx[j]!);
        let feasible = true;
        for (let i = 0; i < m; i++) {
          if (b[i]! - dot(A[i]!, xn) <= 1e-12) {
            feasible = false;
            break;
          }
        }
        if (feasible && f(xn) <= f(x) + 1e-4 * t * dot(gB, dx)) break;
        t *= 0.5;
      }
      x = x.map((v, j) => v + t * dx[j]!);
    }

    let slackMin = Infinity;
    for (let i = 0; i < m; i++) {
      const s = b[i]! - dot(A[i]!, x);
      if (s < slackMin) slackMin = s;
    }
    hooks.onOuter?.(mu, x, f(x), slackMin);

    if (mu * m < eps) break;
    mu *= tau;
  }

  const converged = mu * m < eps;
  return { x, fval: f(x), muFinal: mu, outerIter, iterations: totalIter, converged };
}
