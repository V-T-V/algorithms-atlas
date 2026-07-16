// =============================================================================
// 最小路径和 · 纯算法实现（原地）
// =============================================================================
export interface MinPathHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onDone?: (sum: number) => void;
}

export function minPathSum(grid: number[][], hooks: MinPathHooks = {}): number {
  const m = grid.length;
  if (m === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const n = grid[0]!.length;
  for (let j = 1; j < n; j++) {
    grid[0]![j]! += grid[0]![j - 1]!;
    hooks.onCell?.(0, j, grid[0]![j]!);
  }
  for (let i = 1; i < m; i++) {
    grid[i]![0]! += grid[i - 1]![0]!;
    hooks.onCell?.(i, 0, grid[i]![0]!);
    for (let j = 1; j < n; j++) {
      grid[i]![j]! += Math.min(grid[i - 1]![j]!, grid[i]![j - 1]!);
      hooks.onCell?.(i, j, grid[i]![j]!);
    }
  }
  hooks.onDone?.(grid[m - 1]![n - 1]!);
  return grid[m - 1]![n - 1]!;
}
