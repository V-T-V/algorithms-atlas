import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-coin-change-3',
  categoryId: 'dp',
  title: { zh: '零钱兑换（字典序最小）', en: 'Coin Change (Lexicographically Smallest)' },
  summary: {
    zh: '求凑成总金额的最少硬币数，并输出字典序最小的方案。',
    en: 'Fewest coins to make amount, returning the lexicographically smallest combination.',
  },
  description: {
    zh: 'LeetCode 322 变种。给定面额 coins 与 amount，求最少硬币数；若多解则输出字典序最小的硬币序列（按面额升序）。DP：dp[i]=凑成 i 的最少硬币数，dp[0]=0，dp[i]=min(dp[i-c])+1。回溯构造方案时贪心：从大到小试每个面额 c，若 dp[amount] == dp[amount-c]+1 且选 c 后续可解，则选最小的 c（保证字典序）。时间 O(n·amount)，空间 O(amount)。',
    en: 'LeetCode 322 variant. Fewest coins for amount; among optimal, lexicographically smallest. DP dp[i]=min coins for amount i. Reconstruct greedily picking smallest feasible coin. Time O(n·amount), space O(amount).',
  },
  tags: ['dp', 'knapsack', 'coin-change', 'leetcode'],
  complexity: { time: 'O(n·amount)', space: 'O(amount)' },
};
