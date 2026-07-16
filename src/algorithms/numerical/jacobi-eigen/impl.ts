// =============================================================================
// Jacobi 特征值算法 · 纯算法实现
// 对实对称矩阵反复做 Givens 旋转消除最大非对角元。
// =============================================================================

export interface JacobiEigenHooks {
  onRotation?: (sweep: number, p: number, q: number, theta: number, offDiagonal: number) => void;
  onSweep?: (sweep: number, offDiagonal: number) => void;
}

export interface JacobiEigenResult {
  /** 特征值（对角元）。 */
  eigenvalues: number[];
  /** 特征向量（列）。 */
  eigenvectors: number[][];
  iterations: number;
}

function offDiagonalNorm(A: number[][]): number {
  const n = A.length;
  let s = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) s += A[i]![j]! * A[i]![j]!;
  }
  return Math.sqrt(s);
}

/**
 * Jacobi 特征值算法（对称矩阵）。
 * @param A 对称矩阵（会被复制，不修改入参）
 * @param maxSweeps 最大扫描轮数
 * @param tol 收敛阈值（非对角范数）
 */
export function jacobiEigen(
  AInput: number[][],
  maxSweeps = 100,
  tol = 1e-12,
  hooks: JacobiEigenHooks = {},
): JacobiEigenResult {
  const n = AInput.length;
  // 深拷贝
  const A = AInput.map((row) => [...row]);
  // V 累积特征向量，初始为单位阵
  const V: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(n).fill(0);
    row[i] = 1;
    V.push(row);
  }

  let sweep = 0;
  for (sweep = 1; sweep <= maxSweeps; sweep++) {
    const off = offDiagonalNorm(A);
    hooks.onSweep?.(sweep, off);
    if (off < tol) break;

    // 经典 Jacobi：每轮扫描所有 (p,q) 对
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A[p]![q]!;
        if (Math.abs(apq) < 1e-300) continue;
        const app = A[p]![p]!;
        const aqq = A[q]![q]!;
        // 旋转角
        const theta = 0.5 * Math.atan2(2 * apq, aqq - app);
        const c = Math.cos(theta);
        const s = Math.sin(theta);

        // 更新 A: J^T A J
        // 先更新第 p、q 行/列
        for (let i = 0; i < n; i++) {
          const aip = A[i]![p]!;
          const aiq = A[i]![q]!;
          A[i]![p] = c * aip - s * aiq;
          A[i]![q] = s * aip + c * aiq;
        }
        for (let j = 0; j < n; j++) {
          const apj = A[p]![j]!;
          const aqj = A[q]![j]!;
          A[p]![j] = c * apj - s * aqj;
          A[q]![j] = s * apj + c * aqj;
        }

        // 更新 V
        for (let i = 0; i < n; i++) {
          const vip = V[i]![p]!;
          const viq = V[i]![q]!;
          V[i]![p] = c * vip - s * viq;
          V[i]![q] = s * vip + c * viq;
        }
        hooks.onRotation?.(sweep, p, q, theta, offDiagonalNorm(A));
      }
    }
  }

  const eigenvalues: number[] = [];
  for (let i = 0; i < n; i++) eigenvalues.push(A[i]![i]!);
  // 特征向量是 V 的列
  const eigenvectors: number[][] = [];
  for (let j = 0; j < n; j++) {
    const col: number[] = [];
    for (let i = 0; i < n; i++) col.push(V[i]![j]!);
    eigenvectors.push(col);
  }
  return { eigenvalues, eigenvectors, iterations: sweep };
}
