// =============================================================================
// 出界路径数（LeetCode 576 Out of Boundary Moves）· 纯算法实现
// m×n 网格，从 (r,c) 出发，每步上下左右一格，走 maxMove 步内出界的路径数。
// dp[step][i][j] = 走 step 步后位于 (i,j) 且未出界的路径数；出界的累加到答案。
// =============================================================================

export interface OutOfBoundaryHooks {
  onStep?: (step: number, total: number) => void;
  onResult?: (total: number) => void;
}

export function findPaths(
  m: number,
  n: number,
  maxMove: number,
  startRow: number,
  startCol: number,
  mod = 1_000_000_007,
  hooks: OutOfBoundaryHooks = {},
): number {
  if (maxMove === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  // dp[i][j] 当前步的分布
  let dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  dp[startRow]![startCol] = 1;
  let total = 0;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (let step = 0; step < maxMove; step++) {
    const ndp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const cnt = dp[i]![j]!;
        if (cnt === 0) continue;
        for (const [di, dj] of dirs) {
          const ni = i + di!;
          const nj = j + dj!;
          if (ni < 0 || ni >= m || nj < 0 || nj >= n) {
            total = (total + cnt) % mod;
          } else {
            ndp[ni]![nj] = (ndp[ni]![nj]! + cnt) % mod;
          }
        }
      }
    }
    dp = ndp;
    hooks.onStep?.(step + 1, total);
  }

  hooks.onResult?.(total);
  return total;
}
