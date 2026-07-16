// =============================================================================
// Broyden 方法（良秩一，Broyden's good method）· 纯算法实现
// 求 F(x)=0；维护 B ≈ J⁻¹，秩一更新。
// =============================================================================

export type Mat = number[][];
export type Vec = number[];

export interface BroydenResult {
  x: Vec;
  residual: number; // ||F(x)||
  iterations: number;
  converged: boolean;
}

export interface BroydenHooks {
  onIter?: (iter: number, x: Vec, residual: number, step: number) => void;
  onUpdate?: (s: Vec, z: Vec) => void;
  onResult?: (r: BroydenResult) => void;
}

const identity = (n: number): Mat =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
const matVec = (M: Mat, v: Vec): Vec => M.map((row) => row.reduce((s, m, j) => s + m * v[j]!, 0));
const dot = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i]!, 0);
const norm = (a: Vec): number => Math.sqrt(dot(a, a));
const sub = (a: Vec, b: Vec): Vec => a.map((v, i) => v - b[i]!);
const add = (a: Vec, b: Vec): Vec => a.map((v, i) => v + b[i]!);
const scale = (a: Vec, s: number): Vec => a.map((v) => v * s);

/**
 * Broyden 良秩一更新 B（雅可比逆近似，原地修改）。
 * B ← B + (s − B·F_new) · sᵀ · B / (sᵀ·B·F_new)
 * 注意：F 是「位移后」的残差向量。
 */
export function broydenUpdate(B: Mat, s: Vec, BF: Vec): void {
  const n = B.length;
  const sTBF = dot(s, BF);
  if (Math.abs(sTBF) < 1e-14) return;
  // u = s - BF；B += u · (sᵀ B) / (sᵀ BF)
  // sᵀ B 是一行向量：(Bᵀ s)；这里直接计算 z = Bᵀ s
  const z = matVec(transpose(B), s);
  const u = sub(s, BF);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      B[i]![j] = B[i]![j]! + (u[i]! * z[j]!) / sTBF;
    }
  }
}

function transpose(M: Mat): Mat {
  const n = M.length;
  const m = M[0]!.length;
  const T: Mat = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) T[j]![i] = M[i]![j]!;
  return T;
}

/** 数值雅可比（前向差分），用于初始化 B=J⁻¹ 的近似（这里直接用 J⁻¹ 的近似，初始化为单位阵或差分雅可比）。 */
function numericalJacobian(F: (x: Vec) => Vec, x: Vec, h = 1e-6): Mat {
  const n = x.length;
  const J: Mat = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const f0 = F(x);
  for (let j = 0; j < n; j++) {
    const xp = [...x];
    xp[j]! += h;
    const fp = F(xp);
    for (let i = 0; i < n; i++) J[i]![j] = (fp[i]! - f0[i]!) / h;
  }
  return J;
}

/** 高斯-约旦求逆（小矩阵）。 */
function inverse(M: Mat): Mat {
  const n = M.length;
  const aug: Mat = M.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);
  for (let i = 0; i < n; i++) {
    // 选主元
    let pivot = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k]![i]!) > Math.abs(aug[pivot]![i]!)) pivot = k;
    }
    const rowI = aug[i]!;
    const rowP = aug[pivot]!;
    aug[i] = rowP;
    aug[pivot] = rowI;
    const piv = aug[i]![i]!;
    if (Math.abs(piv) < 1e-14) continue;
    for (let j = 0; j < 2 * n; j++) aug[i]![j] = aug[i]![j]! / piv;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = aug[k]![i]!;
      for (let j = 0; j < 2 * n; j++) aug[k]![j] = aug[k]![j]! - factor * aug[i]![j]!;
    }
  }
  return aug.map((row) => row.slice(n));
}

/**
 * Broyden 方法求 F(x)=0。
 *
 * @param F 非线性函数
 * @param x0 初始点
 * @param options maxIter、tol
 * @param hooks 可选钩子
 */
export function broyden(
  F: (x: Vec) => Vec,
  x0: Vec,
  options: { maxIter?: number; tol?: number; useNumericalInit?: boolean } = {},
  hooks: BroydenHooks = {},
): BroydenResult {
  const { maxIter = 100, tol = 1e-10, useNumericalInit = false } = options;
  const n = x0.length;
  const x = [...x0];
  let Fx = F(x);
  // 初始化 B = J⁻¹（数值）或单位阵
  let B: Mat;
  if (useNumericalInit) {
    const J = numericalJacobian(F, x);
    B = inverse(J);
  } else {
    B = identity(n);
  }
  let iterations = 0;
  let converged = false;
  let residual = norm(Fx);
  for (let k = 1; k <= maxIter; k++) {
    iterations = k;
    if (residual < tol) {
      converged = true;
      break;
    }
    // Δx = −B · F
    const dx = scale(matVec(B, Fx), -1);
    const xnew = add(x, dx);
    const Fnew = F(xnew);
    const s = sub(xnew, x);
    const BF = matVec(B, Fnew);
    broydenUpdate(B, s, BF);
    x.forEach((_, i) => (x[i] = xnew[i]!));
    Fx = Fnew;
    residual = norm(Fx);
    hooks.onUpdate?.(s, BF);
    hooks.onIter?.(k, [...x], residual, norm(dx));
  }
  const result: BroydenResult = { x, residual, iterations, converged };
  hooks.onResult?.(result);
  return result;
}
