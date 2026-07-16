import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-minpath-3',
  categoryId: 'dp',
  title: { zh: '最小路径和', en: 'Minimum Path Sum' },
  summary: {
    zh: 'm×n 网格，从左上到右下每次只能右移或下移，求最小路径和。',
    en: 'Top-left to bottom-right moving only right/down; minimize path sum.',
  },
  description: {
    zh: 'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])。原地修改 grid 即可。',
    en: 'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]); in-place.',
  },
  tags: ['dp', 'grid', 'shortest-path'],
  complexity: { time: 'O(m*n)', space: 'O(1)' },
};
