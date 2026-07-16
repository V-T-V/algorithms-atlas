// =============================================================================
// LU 分解 (Doolittle) · 纯算法实现
// A = L U，L 单位下三角，U 上三角。
// =============================================================================

export interface LUHooks {
  onPivot?: (k: number, uKK: number) => void;
  onEntry?: (i: number, j: number, value: number, which: 'L' | 'U') => void;
}

export interface LUResult {
  L: number[][];
  U: number[][];
}

/**
 * Doolittle LU 分解。
 * @param AInput n×n 方阵
 * @returns { L: 单位下三角, U: 上三角 }
 * 若遇零主元（无部分选主元）抛错。
 */
export function luDecomposition(AInput: number[][], hooks: LUHooks = {}): LUResult {
  const n = AInput.length;
  if (AInput.some((row) => row.length !== n)) {
    throw new RangeError('LU 要求方阵');
  }
  const L: number[][] = [];
  const U: number[][] = [];
  for (let i = 0; i < n; i++) {
    L.push(new Array<number>(n).fill(0));
    U.push(new Array<number>(n).fill(0));
    L[i]![i]! = 1; // 单位下三角
  }

  for (let k = 0; k < n; k++) {
    // U 的第 k 行
    for (let j = k; j < n; j++) {
      let sum = 0;
      for (let m = 0; m < k; m++) sum += L[k]![m]! * U[m]![j]!;
      const val = AInput[k]![j]! - sum;
      U[k]![j]! = val;
      hooks.onEntry?.(k, j, val, 'U');
    }
    if (Math.abs(U[k]![k]!) < 1e-300) {
      throw new Error(`零主元（无部分选主元）：U[${k}][${k}] = 0`);
    }
    hooks.onPivot?.(k, U[k]![k]!);
    // L 的第 k 列
    for (let i = k + 1; i < n; i++) {
      let sum = 0;
      for (let m = 0; m < k; m++) sum += L[i]![m]! * U[m]![k]!;
      const val = (AInput[i]![k]! - sum) / U[k]![k]!;
      L[i]![k]! = val;
      hooks.onEntry?.(i, k, val, 'L');
    }
  }

  return { L, U };
}

/** 前代法：解 L y = b（L 单位下三角）。 */
export function forwardSub(L: number[][], b: number[]): number[] {
  const n = b.length;
  const y = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) sum += L[i]![j]! * y[j]!;
    y[i] = b[i]! - sum;
  }
  return y;
}

/** 回代法：解 U x = y（U 上三角）。 */
export function backSub(U: number[][], y: number[]): number[] {
  const n = y.length;
  const x = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) sum += U[i]![j]! * x[j]!;
    x[i] = (y[i]! - sum) / U[i]![i]!;
  }
  return x;
}

/** 用 LU 分解解 Ax = b。 */
export function luSolve(A: number[][], b: number[]): number[] {
  const { L, U } = luDecomposition(A);
  const y = forwardSub(L, b);
  return backSub(U, y);
}
