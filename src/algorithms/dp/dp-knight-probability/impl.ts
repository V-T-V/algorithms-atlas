// =============================================================================
// 骑士留在棋盘概率（LeetCode 688 Knight Probability in Chessboard）· 纯算法实现
// n×n 棋盘，骑士从 (r,c) 走 k 步（8 个日字方向），每步均匀随机。
// 求走完后仍留在棋盘上的概率。
// dp[step][i][j] = 走 step 步后位于 (i,j) 的概率；滚动数组。
// =============================================================================

export interface KnightHooks {
  onStep?: (step: number, onBoardProb: number) => void;
  onResult?: (prob: number) => void;
}

export function knightProbability(
  n: number,
  k: number,
  r: number,
  c: number,
  hooks: KnightHooks = {},
): number {
  if (n <= 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const dirs = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];
  let dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  if (r < 0 || r >= n || c < 0 || c >= n) {
    hooks.onResult?.(0);
    return 0;
  }
  dp[r]![c] = 1;
  let prob = 1;

  for (let step = 0; step < k; step++) {
    const ndp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    let onBoard = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cnt = dp[i]![j]!;
        if (cnt === 0) continue;
        for (const [di, dj] of dirs) {
          const ni = i + di!;
          const nj = j + dj!;
          if (ni >= 0 && ni < n && nj >= 0 && nj < n) {
            ndp[ni]![nj] = ndp[ni]![nj]! + cnt / 8;
          }
        }
      }
    }
    dp = ndp;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) onBoard += dp[i]![j]!;
    prob = onBoard;
    hooks.onStep?.(step + 1, prob);
  }

  hooks.onResult?.(prob);
  return prob;
}
