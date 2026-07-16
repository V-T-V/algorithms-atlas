// =============================================================================
// 高斯消元 Gauss Elimination · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 含部分主元法（partial pivoting）：处理主元为 0、抑制数值误差。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GaussHooks {
  /** 第 col 列选定了主元行 pivotRow（位于第 col 行）。 */
  onPivot?: (col: number, pivotRow: number, pivotValue: number) => void;
  /** 用主元行消去第 row 行的第 col 列。factor 为消元系数。 */
  onEliminate?: (col: number, pivotRow: number, row: number, factor: number) => void;
}

/** 高斯消元返回结果。 */
export interface GaussResult {
  /** 方程组的解（n 维向量），无唯一解时为长度 0 的数组。 */
  solution: number[];
  /** 消元后的上三角增广矩阵（n 行 × (n+1) 列）。 */
  upper: number[][];
  /** 未知数个数 n。 */
  n: number;
  /** 是否存在唯一解。 */
  unique: boolean;
}

/**
 * 高斯消元法（带部分主元法）求解线性方程组 `A·x = b`。
 *
 * 入参为增广矩阵 `[A | b]`，即 `n` 行 `n+1` 列的二维数组，最后一列为右端项 `b`。
 * 算法分两阶段：
 *
 * 1. **前向消元**：从第 0 列到第 n−1 列，每列在主对角线及以下选绝对值最大的元素作主元
 *    （交换行，即*部分主元法*），再用主元行消去其下方所有行的该列元素，化为上三角。
 *    选最大主元可处理主元恰好为 0 的情形，并显著减小舍入误差。
 * 2. **回代**：从最后一行向上，依次求出 `x_{n−1}, x_{n−2}, …, x_0`。
 *
 * 若消元后某主元为 0（矩阵奇异），则判定无唯一解。
 *
 * 时间复杂度 `O(n³)`，空间 `O(n²)`。
 *
 * @param aug 增广矩阵 [A | b]（n×(n+1)），不会被原地修改
 * @param hooks 可选的事件钩子
 */
export function gaussElimination(
  aug: readonly (readonly number[])[],
  hooks: GaussHooks = {},
): GaussResult {
  const n = aug.length;
  if (n === 0) return { solution: [], upper: [], n: 0, unique: true };
  // 克隆增广矩阵（深拷贝）
  const M: number[][] = aug.map((row) => [...row]);
  const cols = M[0]!.length;
  const EPS = 1e-12;

  // 前向消元（部分主元法）
  for (let col = 0; col < n; col++) {
    // 在 [col, n) 行中选 |M[row][col]| 最大的作为主元行
    let pivotRow = col;
    let maxAbs = Math.abs(M[col]![col]!);
    for (let row = col + 1; row < n; row++) {
      const v = Math.abs(M[row]![col]!);
      if (v > maxAbs) {
        maxAbs = v;
        pivotRow = row;
      }
    }
    // 交换行到主对角位置
    if (pivotRow !== col) {
      const tmp = M[col]!;
      M[col] = M[pivotRow]!;
      M[pivotRow] = tmp;
      pivotRow = col;
    }
    const pivotValue = M[col]![col]!;
    if (Math.abs(pivotValue) < EPS) {
      // 主元为 0 → 奇异
      return { solution: [], upper: M, n, unique: false };
    }
    hooks.onPivot?.(col, pivotRow, pivotValue);

    // 消去下方各行
    for (let row = col + 1; row < n; row++) {
      const factor = M[row]![col]! / pivotValue;
      if (factor === 0) continue;
      for (let k = col; k < cols; k++) {
        M[row]![k] = M[row]![k]! - factor * M[col]![k]!;
      }
      hooks.onEliminate?.(col, pivotRow, row, factor);
    }
  }

  // 回代
  const solution: number[] = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i]![n]!;
    for (let j = i + 1; j < n; j++) {
      s -= M[i]![j]! * solution[j]!;
    }
    const diag = M[i]![i]!;
    if (Math.abs(diag) < EPS) {
      return { solution: [], upper: M, n, unique: false };
    }
    solution[i] = s / diag;
  }

  return { solution, upper: M, n, unique: true };
}
