// =============================================================================
// 排列硬币 · 纯算法实现
// =============================================================================

export interface ArrangeCoinsHooks {
  onRow?: (row: number, used: number) => void;
}

/** 数学解：O(1)。 */
export function arrangeCoins(n: number): number {
  if (n < 0) throw new Error(`n 必须 >= 0 / must be >= 0, got ${n}`);
  return Math.floor((Math.sqrt(1 + 8 * n) - 1) / 2);
}

/** 模拟解（验证用）。 */
export function arrangeCoinsSimulate(n: number, hooks: ArrangeCoinsHooks = {}): number {
  if (n < 0) throw new Error(`n 必须 >= 0 / must be >= 0, got ${n}`);
  let row = 0;
  let used = 0;
  while (used + (row + 1) <= n) {
    row++;
    used += row;
    hooks.onRow?.(row, used);
  }
  return row;
}
