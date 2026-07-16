import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-chessboard',
  categoryId: 'dp',
  title: { zh: '棋盘路径计数', en: 'Chessboard Path Counting' },
  summary: {
    zh: 'm×n 棋盘从左上到右下，只能向右或向下，求不同路径数。',
    en: 'Count distinct paths from top-left to bottom-right on an m×n grid, moving only right or down.',
  },
  description: {
    zh: '在 m×n 的棋盘上，从左上角 (0,0) 出发，每步只能向右或向下走一格，到达右下角 (m-1,n-1)。求不同的路径总数。状态 dp[i][j] = 到达 (i,j) 的路径数，边界（第一行、第一列）均为 1，其余 dp[i][j] = dp[i-1][j] + dp[i][j-1]。答案是 C(m+n-2, m-1) 的组合数，但这里用 DP 表逐步累加更直观。时间 O(mn)。',
    en: 'On an m×n grid, start at (0,0), move right or down to reach (m-1,n-1); count distinct paths. dp[i][j] = paths to (i,j); first row/col all 1; dp[i][j]=dp[i-1][j]+dp[i][j-1]. The answer equals C(m+n-2,m-1) but DP makes accumulation visible. Time O(mn).',
  },
  tags: ['dp', 'grid', 'combinatorics'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
