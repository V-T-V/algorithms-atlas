import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-lcs-4',
  categoryId: 'dp',
  title: { zh: '最长公共子序列（滚动数组优化）', en: 'LCS (Space Optimized)' },
  summary: {
    zh: '两序列的最长公共子序列，用滚动数组把空间降到 O(min(n,m))。',
    en: 'Longest common subsequence with rolling array, space O(min(n,m)).',
  },
  description: {
    zh: '经典 dp：dp[i][j]=LCS(a前i, b前j)。若 a[i-1]==b[j-1] 则 dp[i][j]=dp[i-1][j-1]+1，否则 =max(dp[i-1][j], dp[i][j-1])。只用两行滚动。',
    en: 'Classic dp[i][j]=LCS of first i of a and first j of b. Match: +1; else max of up/left. Two-row rolling.',
  },
  tags: ['dp', 'lcs', 'space-optimization'],
  complexity: { time: 'O(n*m)', space: 'O(min(n,m))' },
};
