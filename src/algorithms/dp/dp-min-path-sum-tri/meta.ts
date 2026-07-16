import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-min-path-sum-tri',
  categoryId: 'dp',
  title: { zh: '三角形最小路径和', en: 'Triangle Minimum Path Sum' },
  summary: {
    zh: '从三角形顶点到底部相邻结点的最小路径和。',
    en: 'Minimum path sum from triangle top to bottom via adjacent numbers.',
  },
  description: {
    zh: 'LeetCode 120。给定三角形 triangle（第 i 行 i+1 个数），从顶到底每次只能走到下一行相邻位置（j 或 j+1），求路径最小和。自底向上 DP：dp[j]=triangle[i][j]+min(dp[j],dp[j+1])，原地滚动从最后一行向上。答案 dp[0]。时间 O(n²)，空间 O(n)。',
    en: 'LeetCode 120. Bottom-up DP: dp[j]=triangle[i][j]+min(dp[j],dp[j+1]); roll from last row up. Answer dp[0]. Time O(n²), space O(n).',
  },
  tags: ['dp', 'triangle', 'path', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
