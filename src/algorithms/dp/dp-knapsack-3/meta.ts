import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-knapsack-3',
  categoryId: 'dp',
  title: { zh: '01 背包（一维滚动数组）', en: '0/1 Knapsack (1D Rolling)' },
  summary: {
    zh: '经典 01 背包，用一维 dp 数组倒序滚动节省空间。',
    en: 'Classic 0/1 knapsack with a 1D rolling array, iterating capacity backwards.',
  },
  description: {
    zh: 'n 件物品各有重量 w[i] 和价值 v[i]，背包容量 W，每件至多取一次。dp[c] 表示容量 c 下能取到的最大价值。倒序遍历 c=W..w[i]：dp[c]=max(dp[c], dp[c-w[i]]+v[i])。倒序确保每件物品只用一次。',
    en: 'Items with weight/value, capacity W, at most one each. Roll dp[c] for c=W..w[i]: dp[c]=max(dp[c], dp[c-w[i]]+v[i]). Reverse order keeps each item used at most once.',
  },
  tags: ['dp', 'knapsack', '0-1'],
  complexity: { time: 'O(nW)', space: 'O(W)' },
};
