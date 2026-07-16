import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-coin-change-4',
  categoryId: 'dp',
  title: { zh: '零钱兑换（贪心失败判定）', en: 'Coin Change (Greedy-Fail Demo)' },
  summary: {
    zh: '对比贪心与 DP：贪心在某些面值下会失败，DP 永远给出最优解。',
    en: 'Contrast greedy with DP: greedy can fail on certain denominations, DP always returns the optimum.',
  },
  description: {
    zh: '给定面值 coins 和金额 amount，求最少硬币数。DP：dp[a]=min(dp[a-c]+1)。本实现同时跑一次贪心（取面值最大的尽量多），并指出贪心在如 [1,3,4] amount=6 时给出 4+1+1=3 枚而非最优 3+3=2 枚。',
    en: 'DP gives dp[a]=min(dp[a-c]+1). We also run greedy for comparison, exposing its failure on denominations like [1,3,4], amount=6.',
  },
  tags: ['dp', 'coin-change', 'greedy', 'comparison'],
  complexity: { time: 'O(n·amount)', space: 'O(amount)' },
};
