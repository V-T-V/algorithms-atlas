// 杨辉三角 · 纯算法实现

/** 事件钩子。 */
export interface PascalHooks {
  /** 生成第 row 行（0-based）。 */
  onRow?: (row: number, values: number[]) => void;
  /** 由上一行 prevRow 的 a、b 计算得到本行某元素 value。 */
  onEntry?: (row: number, col: number, a: number, b: number, value: number) => void;
}

/**
 * 生成 numRows 行的杨辉三角。
 * @returns 二维数组，triangle[r][c] = C(r, c)
 */
export function pascalsTriangle(numRows: number, hooks: PascalHooks = {}): number[][] {
  if (!Number.isInteger(numRows) || numRows < 0) {
    throw new RangeError('numRows must be a non-negative integer');
  }
  const triangle: number[][] = [];
  for (let r = 0; r < numRows; r++) {
    const row: number[] = new Array(r + 1).fill(1);
    for (let c = 1; c < r; c++) {
      const prev = triangle[r - 1]!;
      const value = prev[c - 1]! + prev[c]!;
      row[c] = value;
      hooks.onEntry?.(r, c, prev[c - 1]!, prev[c]!, value);
    }
    triangle.push(row);
    hooks.onRow?.(r, [...row]);
  }
  return triangle;
}

/** 取第 n 行（0-based）的二项式系数 C(n,0..n)。 */
export function pascalRow(n: number): number[] {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be non-negative integer');
  const row: number[] = [1];
  for (let k = 1; k <= n; k++) {
    // C(n,k) = C(n,k-1) * (n-k+1) / k
    row[k] = Math.round((row[k - 1]! * (n - k + 1)) / k);
  }
  return row;
}
