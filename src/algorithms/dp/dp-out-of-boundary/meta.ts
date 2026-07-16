import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-out-of-boundary',
  categoryId: 'dp',
  title: { zh: '出界路径数', en: 'Out of Boundary Paths' },
  summary: {
    zh: '网格四向移动，maxMove 步内走出边界的路径数（取模）。',
    en: 'Count paths leaving an m-by-n grid within maxMove moves (mod).',
  },
  description: {
    zh: '在 m×n 网格中从 (startRow, startCol) 出发，每步可向上/下/左/右移动一格，球一旦出界便消失。求在最多 maxMove 步内使球出界的不同路径数（对 1e9+7 取模）。状态 dp[i][j] 表示「当前步数下球位于 (i,j) 且未出界」的路径数，每步把每个位置的计数沿四个方向扩散，越界的累加进答案。时间 O(maxMove·m·n)。',
    en: 'From (startRow, startCol) in an m-by-n grid, move up/down/left/right each step; the ball vanishes once it leaves the grid. Count distinct paths that take the ball out of bounds within maxMove moves (mod 1e9+7). State dp[i][j] = paths currently at (i,j) still in-bounds; each step fans counts in four directions, adding boundary-crossing counts to the answer. Time O(maxMove·m·n).',
  },
  tags: ['dp', 'grid', 'counting', 'modular', 'leetcode'],
  complexity: { time: 'O(maxMove·m·n)', space: 'O(m·n)' },
};
