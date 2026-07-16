import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-knap-4',
  categoryId: 'dp',
  title: { zh: '0-1 背包（一维滚动）', en: '0-1 Knapsack (1D Rolling)' },
  summary: {
    zh: 'n 个物品、容量 W，每物品取或不取，求最大价值。空间 O(W)。',
    en: '0-1 knapsack with 1D rolling array, space O(W).',
  },
  description: {
    zh: 'dp[j] = 容量 j 时的最大价值。倒序遍历 j（保证每物品只取一次）：dp[j]=max(dp[j], dp[j-w[i]]+v[i])。',
    en: 'dp[j] = max value under capacity j. Iterate j descending to use each item at most once.',
  },
  tags: ['dp', 'knapsack', 'space-optimization'],
  complexity: { time: 'O(n*W)', space: 'O(W)' },
};
