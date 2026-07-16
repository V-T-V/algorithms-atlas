import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-min-path-2',
  categoryId: 'dp',
  title: { zh: '最小路径和（带障碍）', en: 'Minimum Path Sum with Obstacles' },
  summary: {
    zh: '在带障碍的网格上从左上走到右下，每次只能向右或向下，求最小权和。',
    en: 'From top-left to bottom-right on a grid with obstacles; move right/down; minimize cost.',
  },
  description: {
    zh: 'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])；障碍格 dp 设为 ∞。起点 dp[0][0]=grid[0][0]。',
    en: 'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]); obstacle cells become ∞; start dp[0][0]=grid[0][0].',
  },
  tags: ['dp', 'grid', 'path'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
