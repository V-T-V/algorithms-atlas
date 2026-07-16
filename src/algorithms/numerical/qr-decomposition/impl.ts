// =============================================================================
// QR 分解 (Gram-Schmidt) · 纯算法实现
// A (m×n, m>=n) = Q (m×n, 列正交) × R (n×n, 上三角)
// =============================================================================

export interface QRHooks {
  onColumn?: (k: number, qk: number[], rRow: number[]) => void;
}

export interface QRResult {
  Q: number[][];
  R: number[][];
}

function dotCol(A: number[][], colI: number, colJ: number): number {
  let s = 0;
  for (let i = 0; i < A.length; i++) s += A[i]![colI]! * A[i]![colJ]!;
  return s;
}

function normCol(A: number[][], col: number): number {
  return Math.sqrt(dotCol(A, col, col));
}

/**
 * 经典 Gram-Schmidt QR 分解。
 * @param AInput m×n 矩阵（m >= n，列满秩）
 * @returns { Q: m×n（正交列）, R: n×n（上三角） }
 */
export function qrDecomposition(AInput: number[][], hooks: QRHooks = {}): QRResult {
  const m = AInput.length;
  const n = AInput[0]!.length;
  if (m < n) throw new RangeError(`要求行数 >= 列数，收到 ${m}×${n}`);

  // 工作矩阵（每列将被改造为 q）
  const Q: number[][] = AInput.map((row) => [...row]);
  const R: number[][] = [];
  for (let i = 0; i < n; i++) R.push(new Array<number>(n).fill(0));

  for (let k = 0; k < n; k++) {
    // r_kk = ||a_k||
    const rKK = normCol(Q, k);
    R[k]![k]! = rKK;
    if (rKK < 1e-300) throw new Error(`矩阵列线性相关（列 ${k}）`);
    // q_k = a_k / r_kk
    for (let i = 0; i < m; i++) Q[i]![k]! /= rKK;
    // 对后续列 j>k：减去其在 q_k 上的投影
    for (let j = k + 1; j < n; j++) {
      const rKJ = dotCol(Q, k, j); // = q_k · a_j
      R[k]![j]! = rKJ;
      for (let i = 0; i < m; i++) Q[i]![j]! -= rKJ * Q[i]![k]!;
    }
    const qk = Q.map((row) => row[k]!);
    const rRow = [...R[k]!];
    hooks.onColumn?.(k, qk, rRow);
  }

  return { Q, R };
}
