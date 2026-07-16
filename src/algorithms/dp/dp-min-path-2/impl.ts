// =============================================================================
// 最小路径和（带障碍）
// =============================================================================

export interface MinPathHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onDone?: (best: number) => void;
}

export function minPathSumObstacle(
  grid: readonly (readonly number[])[],
  blocked: readonly (readonly boolean[])[] | undefined,
  hooks: MinPathHooks = {},
): number {
  const m = grid.length;
  if (m === 0) return -1;
  const n = grid[0]!.length;
  const INF = Number.POSITIVE_INFINITY;
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(INF));
  const isBlocked = (i: number, j: number): boolean => !!blocked?.[i]?.[j];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (isBlocked(i, j)) {
        dp[i]![j] = INF;
        hooks.onCell?.(i, j, INF);
        continue;
      }
      if (i === 0 && j === 0) {
        dp[i]![j] = grid[i]![j]!;
      } else {
        const up = i > 0 ? dp[i - 1]![j]! : INF;
        const left = j > 0 ? dp[i]![j - 1]! : INF;
        dp[i]![j] = grid[i]![j]! + Math.min(up, left);
      }
      hooks.onCell?.(i, j, dp[i]![j]!);
    }
  }
  const ans = Number.isFinite(dp[m - 1]![n - 1]!) ? dp[m - 1]![n - 1]! : -1;
  hooks.onDone?.(ans);
  return ans;
}
