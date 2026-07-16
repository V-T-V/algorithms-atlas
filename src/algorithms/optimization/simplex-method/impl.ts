// =============================================================================
// 单纯形法（线性规划）· 纯算法实现
// 求 max c·x  s.t.  A x ≤ b, x ≥ 0（b ≥ 0 自动得到初始可行基）。
// 用单纯形表 + 高斯旋转。零 DOM 依赖，可独立单测。
// =============================================================================

export interface SimplexResult {
  /** 最优解（原始变量部分）。 */
  solution: number[];
  /** 最优目标值。 */
  optimalValue: number;
  /** 是否达到最优（未退化或循环）。 */
  optimal: boolean;
  /** 迭代次数。 */
  iterations: number;
}

export interface SimplexHooks {
  onPivot?: (iter: number, pivotRow: number, pivotCol: number, tableau: number[][]) => void;
}

export interface SimplexOptions {
  maxIterations?: number;
  /** 数值容差。默认 1e-9。 */
  eps?: number;
}

/**
 * 单纯形法：max c·x, A x ≤ b, x ≥ 0。
 *
 * @param A 约束矩阵 m×n
 * @param b 右端项 m（需非负以保证初始基可行）
 * @param c 目标系数 n（最大化）
 */
export function simplexMethod(
  A: number[][],
  b: number[],
  c: number[],
  options: SimplexOptions = {},
  hooks: SimplexHooks = {},
): SimplexResult {
  const maxIter = options.maxIterations ?? 1000;
  const eps = options.eps ?? 1e-9;
  const m = A.length;
  const n = c.length;

  // 构造表：行 0 = 目标（z − c·x = 0），其后 m 行约束 + 松弛变量
  // 列：n 个原始 + m 个松弛 + 1 个 RHS
  const numCols = n + m + 1;
  const table: number[][] = [];

  // 目标行：−c（最大化的判别数）
  table.push([...c.map((v) => -v), ...new Array<number>(m).fill(0), 0]);

  for (let i = 0; i < m; i++) {
    const row = [...A[i]!, ...new Array<number>(m).fill(0), b[i]!];
    row[n + i]! = 1; // 松弛变量系数
    table.push(row);
  }

  // 基变量：初始为松弛变量
  const basis: number[] = Array.from({ length: m }, (_, i) => n + i);

  let iter = 0;
  for (; iter < maxIter; iter++) {
    // 1. 找进基列（最负的判别数）
    let pivotCol = -1;
    let minVal = -eps;
    for (let j = 0; j < n + m; j++) {
      if (table[0]![j]! < minVal) {
        minVal = table[0]![j]!;
        pivotCol = j;
      }
    }
    if (pivotCol === -1) {
      // 所有判别数非负 → 最优
      break;
    }

    // 2. 最小比值规则选离基行
    let pivotRow = -1;
    let minRatio = Infinity;
    for (let i = 1; i <= m; i++) {
      const aij = table[i]![pivotCol]!;
      if (aij > eps) {
        const ratio = table[i]![numCols - 1]! / aij;
        if (ratio < minRatio - eps) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }
    if (pivotRow === -1) {
      // 无界
      return {
        solution: new Array<number>(n).fill(0),
        optimalValue: Infinity,
        optimal: false,
        iterations: iter,
      };
    }

    hooks.onPivot?.(
      iter,
      pivotRow,
      pivotCol,
      table.map((r) => [...r]),
    );

    // 3. 旋转
    const piv = table[pivotRow]![pivotCol]!;
    for (let j = 0; j < numCols; j++) table[pivotRow]![j]! /= piv;
    for (let i = 0; i <= m; i++) {
      if (i === pivotRow) continue;
      const factor = table[i]![pivotCol]!;
      if (Math.abs(factor) < eps) continue;
      for (let j = 0; j < numCols; j++) {
        table[i]![j]! -= factor * table[pivotRow]![j]!;
      }
    }
    basis[pivotRow - 1] = pivotCol;
  }

  // 提取解
  const solution = new Array<number>(n).fill(0);
  for (let i = 0; i < m; i++) {
    const varIdx = basis[i]!;
    if (varIdx < n) solution[varIdx] = table[i + 1]![numCols - 1]!;
  }
  const optimalValue = table[0]![numCols - 1]!;

  return {
    solution,
    optimalValue,
    optimal: iter < maxIter,
    iterations: iter,
  };
}

/** 演示：max 3x₁ + 5x₂, x₁ ≤ 4, 2x₂ ≤ 12, 3x₁ + 2x₂ ≤ 18 → 最优 36。 */
export function demoProblem(): {
  A: number[][];
  b: number[];
  c: number[];
  expectX: number[];
  expectZ: number;
} {
  const A = [
    [1, 0],
    [0, 2],
    [3, 2],
  ];
  const b = [4, 12, 18];
  const c = [3, 5];
  return { A, b, c, expectX: [2, 6], expectZ: 36 };
}
