// =============================================================================
// 带位移的幂法 · 纯算法实现
// 反复做 v ← (A - σI) v 归一化，λ = σ + Rayleigh 商。
// =============================================================================

export interface PowerShiftHooks {
  onIter?: (iter: number, v: number[], mu: number, lambda: number) => void;
}

export interface PowerShiftResult {
  eigenvalue: number;
  eigenvector: number[];
  iterations: number;
  converged: boolean;
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]! * b[i]!;
  return s;
}

function matVec(A: number[][], v: number[]): number[] {
  return A.map((row) => row.reduce((acc, a, j) => acc + a * v[j]!, 0));
}

/**
 * 带位移的幂法。
 * @param A 方阵
 * @param shift σ（A - σI 的幂法）
 * @param maxIter 最大迭代
 * @param tol 收敛阈值（μ 的相对变化）
 */
export function powerMethodShift(
  A: number[][],
  shift = 0,
  maxIter = 1000,
  tol = 1e-10,
  hooks: PowerShiftHooks = {},
): PowerShiftResult {
  const n = A.length;
  // 初始向量：全 1（避免正交）
  let v = new Array<number>(n).fill(1);
  // 归一化
  const norm0 = Math.sqrt(dot(v, v));
  v = v.map((x) => x / norm0);

  let mu = 0; // (A-σI) 的最大特征值估计
  let converged = false;
  let iter = 0;
  for (iter = 1; iter <= maxIter; iter++) {
    // w = (A - σI) v = A v - σ v
    const Av = matVec(A, v);
    const w = Av.map((x, i) => x - shift * v[i]!);
    // μ = v · w（Rayleigh 商 of A-σI）
    const newMu = dot(v, w);
    const norm = Math.sqrt(dot(w, w));
    if (norm < 1e-300) {
      // v 几乎是 (A-σI) 的零向量，说明 σ ≈ 某特征值
      mu = newMu;
      converged = true;
      hooks.onIter?.(iter, [...v], mu, shift + mu);
      break;
    }
    v = w.map((x) => x / norm);
    hooks.onIter?.(iter, [...v], newMu, shift + newMu);
    if (iter > 1 && Math.abs(newMu - mu) < tol * (Math.abs(newMu) + 1e-300)) {
      mu = newMu;
      converged = true;
      break;
    }
    mu = newMu;
  }
  // λ(A) = σ + μ(A - σI)
  return { eigenvalue: shift + mu, eigenvector: v, iterations: iter, converged };
}
