// =============================================================================
// 矩阵中最长递增路径（LeetCode 329 Longest Increasing Path）· 纯算法实现
// 从每个格子出发只能向「数值更大」的相邻格走，求最长路径长度。
// 记忆化 DFS：memo[i][j] = 从 (i,j) 出发的最长路径，按需递归。
// =============================================================================

export interface LipHooks {
  onVisit?: (i: number, j: number, len: number) => void;
  onResult?: (maxLen: number) => void;
}

export function longestIncreasingPath(
  matrix: ReadonlyArray<readonly number[]>,
  hooks: LipHooks = {},
): number {
  const m = matrix.length;
  if (m === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const n = matrix[0]!.length;
  const memo: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let best = 0;

  const dfs = (i: number, j: number): number => {
    if (memo[i]![j]! > 0) return memo[i]![j]!;
    let maxSub = 0;
    for (const [di, dj] of dirs) {
      const ni = i + di!;
      const nj = j + dj!;
      if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue;
      if (matrix[ni]![nj]! > matrix[i]![j]!) {
        const sub = dfs(ni, nj);
        if (sub > maxSub) maxSub = sub;
      }
    }
    memo[i]![j] = maxSub + 1;
    hooks.onVisit?.(i, j, memo[i]![j]!);
    if (memo[i]![j]! > best) best = memo[i]![j]!;
    return memo[i]![j]!;
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      dfs(i, j);
    }
  }

  hooks.onResult?.(best);
  return best;
}
