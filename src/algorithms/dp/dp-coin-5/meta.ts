import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-coin-5',
  categoryId: 'dp',
  title: { zh: '零钱兑换（求最少硬币数）', en: 'Coin Change (Min Coins)' },
  summary: {
    zh: '给定硬币面额，凑出金额 amount 所需的最少硬币数。',
    en: 'Minimum number of coins to make up amount.',
  },
  description: {
    zh: '完全背包：dp[i] = 凑金额 i 的最少硬币数。dp[0]=0；dp[i]=min(dp[i-coin]+1)。',
    en: 'Unbounded knapsack: dp[i]=min coins for amount i. dp[i]=min(dp[i-coin]+1) over coins.',
  },
  tags: ['dp', 'coin-change', 'unbounded-knapsack'],
  complexity: { time: 'O(amount*n)', space: 'O(amount)' },
};
