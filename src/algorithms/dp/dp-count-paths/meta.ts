import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-count-paths',
  categoryId: 'dp',
  title: { zh: '路径计数', en: 'Count Paths' },
  summary: {
    zh: '网格只能向右或向下，求从左上到右下的路径总数。',
    en: 'Count grid paths from top-left to bottom-right moving only right or down.',
  },
  description: {
    zh: '在一个 m×n 的网格中，从左上角 (0,0) 出发，每步只能向右或向下走一格，求到达右下角 (m-1,n-1) 的不同路径数。状态 dp[i][j] = 到达 (i,j) 的路径数，转移 dp[i][j] = dp[i-1][j] + dp[i][j-1]，第一行和第一列恒为 1。答案等于 C(m+n-2, m-1)。时间 O(mn)。',
    en: 'In an m-by-n grid, moving only right or down from the top-left, count distinct paths to the bottom-right. State dp[i][j] = paths to (i,j), with dp[i][j] = dp[i-1][j] + dp[i][j-1]; the first row and column are all 1. The answer equals C(m+n-2, m-1). Time O(mn).',
  },
  tags: ['dp', 'grid', 'combinatorics', 'counting'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
