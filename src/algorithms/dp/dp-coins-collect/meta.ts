import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-coins-collect',
  categoryId: 'dp',
  title: { zh: '网格收集金币', en: 'Coins Collect on Grid' },
  summary: {
    zh: '从左上走到右下，每格有金币，只能向右或向下，求最大收益。',
    en: 'Walk top-left to bottom-right collecting coins; only right/down moves; maximize total.',
  },
  description: {
    zh: '给定 m×n 网格，每格有非负金币数。从 (0,0) 出发，每步只能向右或向下走到 (m-1,n-1)，求经过路径上的金币总和最大值。状态 dp[i][j] = 到达 (i,j) 的最大金币，转移 dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i][j-1])（边界处只能从单一方向来）。时间 O(mn)。',
    en: 'Given an m×n grid of non-negative coins, start at (0,0), move only right or down to (m-1,n-1), maximize coins collected. State dp[i][j] = max coins to reach (i,j), transition dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i][j-1]) (single source on borders). Time O(mn).',
  },
  tags: ['dp', 'grid', 'path'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
