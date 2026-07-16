// =============================================================================
// 珠排序变种（计数实现）· 纯算法实现
// 仅处理非负整数；用 max×n 的珠子矩阵模拟重力下落。
// =============================================================================
export interface BeadSortHooks {
  /** 给出每列（每个输入数）铺设珠子后的网格快照。 */
  onLay?: (grid: number[][]) => void;
  /** 重力下落后（按列计数）每行的珠子数。 */
  onFall?: (rowCounts: number[]) => void;
}

/**
 * 珠排序（计数矩阵实现）。
 * @param arr 非负整数数组（克隆后操作）
 * @param hooks 可选的事件钩子
 */
export function beadSort(arr: readonly number[], hooks: BeadSortHooks = {}): number[] {
  if (arr.length === 0) return [];
  for (const v of arr) {
    if (!Number.isInteger(v) || v < 0) {
      throw new Error('beadSort 仅支持非负整数');
    }
  }
  const n = arr.length;
  const max = Math.max(...arr);
  if (max === 0) return new Array<number>(n).fill(0);

  // grid[r][c] = 1 表示第 c 列、从底数第 r 行有一颗珠子（r 从 0=底）
  const grid: number[][] = Array.from({ length: max }, () => new Array<number>(n).fill(0));
  for (let c = 0; c < n; c++) {
    const h = arr[c]!;
    for (let r = 0; r < h; r++) grid[r]![c] = 1;
  }
  hooks.onLay?.(grid.map((row) => [...row]));

  // 重力：珠子下落等价于统计每行（每个原始值）的珠子，再重新分布。
  // 经典 bead sort：每行的珠子总数 = 该行的「宽度」，结果 = 各行宽度（升序）。
  // 为得到升序输出，统计每列总珠子数后重新铺设（下落），再读每行珠子数。
  const colSum = new Array<number>(n).fill(0);
  for (let r = 0; r < max; r++) {
    for (let c = 0; c < n; c++) colSum[c]! += grid[r]![c]!;
  }
  // 下落：每列的珠子全部落到底；重新生成网格使每列底部 colSum[c] 个为 1
  const fallen: number[][] = Array.from({ length: max }, () => new Array<number>(n).fill(0));
  for (let c = 0; c < n; c++) {
    const h = colSum[c]!;
    for (let r = 0; r < h; r++) fallen[r]![c] = 1;
  }
  // 每行珠子数（升序）
  const rowCounts = fallen.map((row) => row.reduce((a, b) => a + b, 0));
  hooks.onFall?.([...rowCounts]);

  return rowCounts;
}
