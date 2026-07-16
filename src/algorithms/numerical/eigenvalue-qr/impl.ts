// =============================================================================
// QR 迭代求特征值（Eigenvalue via QR Iteration）· 纯算法实现
// Gram-Schmidt QR 分解 + Wilkinson 平移
// =============================================================================

export interface EigenQRHooks {
  /** 第 iter 次迭代后的矩阵。 */
  onIter?: (iter: number, ak: number[][]) => void;
  /** 完成。 */
  onDone?: (eigenvalues: number[]) => void;
}

type Mat = number[][];

function matClone(a: Mat): Mat {
  return a.map((row) => [...row]);
}

function matMul(a: Mat, b: Mat): Mat {
  const n = a.length;
  const m = b[0]!.length;
  const p = b.length;
  const out: Mat = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let s = 0;
      for (let k = 0; k < p; k++) s += a[i]![k]! * b[k]![j]!;
      out[i]![j] = s;
    }
  }
  return out;
}

/** Gram-Schmidt QR 分解：A (n×n) = Q·R，返回 [Q, R]。 */
function qrDecompose(a: Mat): [Q: Mat, R: Mat] {
  const n = a.length;
  const Q: Mat = Array.from({ length: n }, () => new Array(n).fill(0));
  const R: Mat = Array.from({ length: n }, () => new Array(n).fill(0));
  // 取列向量
  for (let k = 0; k < n; k++) {
    // v = a[:,k]
    let v = a.map((row) => row[k]!);
    for (let j = 0; j < k; j++) {
      // R[j][k] = Q[:,j]·a[:,k]
      let dot = 0;
      for (let i = 0; i < n; i++) dot += Q[i]![j]! * a[i]![k]!;
      R[j]![k] = dot;
      // v -= R[j][k] * Q[:,j]
      v = v.map((x, i) => x - dot * Q[i]![j]!);
    }
    // R[k][k] = |v|
    let norm = 0;
    for (const x of v) norm += x * x;
    norm = Math.sqrt(norm);
    R[k]![k] = norm;
    // Q[:,k] = v / norm
    if (norm > 1e-12) {
      for (let i = 0; i < n; i++) Q[i]![k] = v[i]! / norm;
    }
  }
  return [Q, R];
}

/** Wilkinson 平移：取右下 2×2 子块更接近 A[n-1][n-1] 的特征值。 */
function wilkinsonShift(a: Mat): number {
  const n = a.length;
  if (n < 2) return a[0]![0]!;
  const d = a[n - 2]![n - 2]!;
  const e = a[n - 2]![n - 1]!;
  const f = a[n - 1]![n - 1]!;
  const delta = (d - f) / 2;
  const sign = delta >= 0 ? 1 : -1;
  const denom = Math.abs(delta) + Math.sqrt(delta * delta + e * e);
  if (denom === 0) return f;
  return f - (sign * e * e) / denom;
}

/**
 * QR 迭代求特征值。
 * @param matrix n×n 实方阵
 * @param maxIter 最大迭代次数
 * @param tol 收敛阈值（次对角元最大绝对值 < tol）
 */
export function eigenvaluesQR(
  matrix: readonly number[][],
  maxIter = 200,
  tol = 1e-10,
  hooks: EigenQRHooks = {},
): number[] {
  const n = matrix.length;
  if (n === 0) return [];
  if (matrix.some((row) => row.length !== n)) throw new RangeError('须为方阵');
  let a = matClone(matrix as Mat);
  for (let iter = 0; iter < maxIter; iter++) {
    // 检查次对角收敛
    let offDiag = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) offDiag += a[i]![j]! * a[i]![j]!;
      }
    }
    if (Math.sqrt(offDiag) < tol) {
      hooks.onDone?.(a.map((row, i) => row[i]!));
      return a.map((row, i) => row[i]!);
    }
    // Wilkinson 平移
    const mu = wilkinsonShift(a);
    const shifted = a.map((row, i) => row.map((v, j) => v - (i === j ? mu : 0)));
    const [Q, R] = qrDecompose(shifted);
    a = matMul(R, Q);
    // 反平移
    a = a.map((row, i) => row.map((v, j) => v + (i === j ? mu : 0)));
    hooks.onIter?.(iter, matClone(a));
  }
  hooks.onDone?.(a.map((row, i) => row[i]!));
  return a.map((row, i) => row[i]!);
}
