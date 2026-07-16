// =============================================================================
// 奇异值分解（SVD）· 纯算法实现
// 单边 Jacobi（One-Sided Jacobi）：对列做 Givens 旋转使列正交。
// =============================================================================

export interface SVDResult {
  /** 左奇异向量（列即 U[:,k]）。 */
  U: number[][];
  /** 奇异值，降序。 */
  singularValues: number[];
  /** 右奇异向量（列即 V[:,k]）。 */
  V: number[][];
}

export interface SVDHooks {
  /** 一次旋转 (p,q)。 */
  onRotation?: (iter: number, p: number, q: number) => void;
  /** 完成一次扫描后的列范数。 */
  onSweep?: (sweep: number, colNorms: number[]) => void;
  /** 完成。 */
  onDone?: (result: SVDResult) => void;
}

type Mat = number[][];

function clone(a: Mat): Mat {
  return a.map((r) => [...r]);
}

/** 求 m×n 矩阵的第 j 列。 */
function col(a: Mat, j: number): number[] {
  return a.map((row) => row[j]!);
}

function dot(u: number[], v: number[]): number {
  let s = 0;
  for (let i = 0; i < u.length; i++) s += u[i]! * v[i]!;
  return s;
}

function norm(v: number[]): number {
  return Math.sqrt(dot(v, v));
}

/**
 * 单边 Jacobi SVD。
 * @param A m×n 矩阵（m >= n 效果最好；m < n 时对 Aᵀ 求解）
 */
export function svd(
  A: readonly number[][],
  maxSweeps = 60,
  tol = 1e-12,
  hooks: SVDHooks = {},
): SVDResult {
  if (A.length === 0) return { U: [], singularValues: [], V: [] };
  const m = A.length;
  const n = A[0]!.length;
  if (n === 0) return { U: [], singularValues: [], V: [] };

  // 若 m < n，对 Aᵀ 求解后交换 U、V
  if (m < n) {
    const At: Mat = Array.from({ length: n }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) At[j]![i] = A[i]![j]!;
    const sub = svd(At, maxSweeps, tol, hooks);
    return { U: sub.V, singularValues: sub.singularValues, V: sub.U };
  }

  const B = clone(A as Mat);
  const V: Mat = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let rotated = false;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const ap = col(B, p);
        const aq = col(B, q);
        const app = dot(ap, ap);
        const aqq = dot(aq, aq);
        const apq = dot(ap, aq);
        // 列已近似正交则跳过
        if (Math.abs(apq) <= tol * Math.sqrt(app * aqq) || Math.abs(apq) < 1e-300) continue;
        // 旋转角（使列正交）
        const tau = (aqq - app) / (2 * apq);
        let t: number;
        if (tau >= 0) t = 1 / (tau + Math.sqrt(1 + tau * tau));
        else t = -1 / (-tau + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;
        // 应用到 B 的两列
        for (let i = 0; i < m; i++) {
          const bip = B[i]![p]!;
          const biq = B[i]![q]!;
          B[i]![p] = c * bip - s * biq;
          B[i]![q] = s * bip + c * biq;
        }
        // V ← V·J
        for (let i = 0; i < n; i++) {
          const vip = V[i]![p]!;
          const viq = V[i]![q]!;
          V[i]![p] = c * vip - s * viq;
          V[i]![q] = s * vip + c * viq;
        }
        rotated = true;
        hooks.onRotation?.(sweep, p, q);
      }
    }
    const colNorms = Array.from({ length: n }, (_, j) => norm(col(B, j)));
    hooks.onSweep?.(sweep, colNorms);
    if (!rotated) break;
  }

  // 奇异值 = 各列范数；按降序排序
  const idx = Array.from({ length: n }, (_, i) => i);
  const colNorms = idx.map((j) => norm(col(B, j)));
  idx.sort((a, b) => colNorms[b]! - colNorms[a]!);
  const singularValues = idx.map((j) => colNorms[j]!);
  // U[:,k] = B[:,idx[k]] / σ_k；V[:,k] = V[:,idx[k]]
  const U: Mat = Array.from({ length: m }, () => new Array(n).fill(0));
  const Vsorted: Mat = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let k = 0; k < n; k++) {
    const j = idx[k]!;
    const sigma = singularValues[k]!;
    for (let i = 0; i < m; i++) U[i]![k] = sigma > 1e-12 ? B[i]![j]! / sigma : 0;
    for (let i = 0; i < n; i++) Vsorted[i]![k] = V[i]![j]!;
  }
  const result: SVDResult = { U, singularValues, V: Vsorted };
  hooks.onDone?.(result);
  return result;
}

/** 重构 A = U·diag(σ)·Vᵀ（用于验证）。 */
export function reconstruct(svd: SVDResult): Mat {
  const m = svd.U.length;
  const n = svd.V.length;
  const r = svd.singularValues.length;
  const out: Mat = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < r; k++) s += svd.U[i]![k]! * svd.singularValues[k]! * svd.V[j]![k]!;
      out[i]![j] = s;
    }
  }
  return out;
}
