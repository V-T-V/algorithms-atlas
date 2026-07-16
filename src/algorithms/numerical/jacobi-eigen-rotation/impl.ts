// =============================================================================
// Jacobi 旋转求特征值（单旋转）· 纯算法实现
// 适用于实对称矩阵。
// =============================================================================

export interface JacobiResult {
  eigenvalues: number[];
  eigenvectors: number[][];
}

export interface JacobiEigenHooks {
  /** 一次旋转后给出 (p, q) 与当前对角。 */
  onRotation?: (iter: number, p: number, q: number, diagonal: number[]) => void;
  /** 完成。 */
  onDone?: (result: JacobiResult) => void;
}

type Mat = number[][];

function clone(a: Mat): Mat {
  return a.map((r) => [...r]);
}

/** 找当前最大的非对角元 |a_{pq}|。 */
function findLargestOffDiagonal(a: Mat): { p: number; q: number; val: number } {
  const n = a.length;
  let p = 0;
  let q = 1;
  let max = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(a[i]![j]!) > max) {
        max = Math.abs(a[i]![j]!);
        p = i;
        q = j;
      }
    }
  }
  return { p, q, val: a[p]![q]! };
}

/** 非对角元平方和。 */
function offDiagonalNorm(a: Mat): number {
  const n = a.length;
  let s = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) s += a[i]![j]! * a[i]![j]!;
  return Math.sqrt(s);
}

/**
 * Jacobi 旋转法求对称矩阵的特征值与特征向量。
 * @param matrix n×n 实对称矩阵
 * @param maxIter 最大旋转次数
 * @param tol 收敛阈值（非对角范数 < tol）
 */
export function jacobiEigen(
  matrix: readonly number[][],
  maxIter = 100,
  tol = 1e-10,
  hooks: JacobiEigenHooks = {},
): JacobiResult {
  const n = matrix.length;
  if (n === 0) return { eigenvalues: [], eigenvectors: [] };
  if (matrix.some((r) => r.length !== n)) throw new RangeError('须为方阵');
  let a = clone(matrix as Mat);
  // 对称性检查
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(a[i]![j]! - a[j]![i]!) > 1e-9) throw new RangeError('矩阵须对称');
    }
  }
  // V 累积特征向量
  let V: Mat = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );

  for (let iter = 0; iter < maxIter; iter++) {
    if (offDiagonalNorm(a) < tol) break;
    const { p, q } = findLargestOffDiagonal(a);
    const app = a[p]![p]!;
    const aqq = a[q]![q]!;
    const apq = a[p]![q]!;
    // 旋转角
    const theta = 0.5 * Math.atan2(2 * apq, aqq - app);
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    // 应用旋转 JᵀAJ：更新 A 与 V
    const newA = clone(a);
    for (let i = 0; i < n; i++) {
      const aip = a[i]![p]!;
      const aiq = a[i]![q]!;
      newA[i]![p] = c * aip - s * aiq;
      newA[i]![q] = s * aip + c * aiq;
    }
    for (let j = 0; j < n; j++) {
      const apj = newA[p]![j]!;
      const aqj = newA[q]![j]!;
      newA[p]![j] = c * apj - s * aqj;
      newA[q]![j] = s * apj + c * aqj;
    }
    a = newA;
    // V ← V·J
    const newV = clone(V);
    for (let i = 0; i < n; i++) {
      const vip = V[i]![p]!;
      const viq = V[i]![q]!;
      newV[i]![p] = c * vip - s * viq;
      newV[i]![q] = s * vip + c * viq;
    }
    V = newV;
    hooks.onRotation?.(
      iter,
      p,
      q,
      a.map((row, i) => row[i]!),
    );
  }

  const eigenvalues = a.map((row, i) => row[i]!);
  // 特征向量 = V 的列；eigenvectors[k][i] = 第 k 个特征向量的第 i 分量 = V[i][k]
  const eigenvectors: Mat = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) eigenvectors[k]![i] = V[i]![k]!;
  }
  const result = { eigenvalues, eigenvectors };
  hooks.onDone?.(result);
  return result;
}
