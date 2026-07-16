import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-paint-3',
  categoryId: 'dp',
  title: { zh: '粉刷房子', en: 'Paint House' },
  summary: {
    zh: 'n 个房子，每房只能粉刷红/蓝/绿一种颜色，相邻不能同色，求最小成本。',
    en: 'n houses, paint each red/blue/green, no two adjacent same color; min cost.',
  },
  description: {
    zh: 'dp[k][c]=刷到第 k 房且该房颜色 c 的最小成本。dp[k][c]=cost[k][c]+min(dp[k-1][非c])。',
    en: 'dp[k][c]=min cost to paint first k houses with kth color c. dp[k][c]=cost[k][c]+min(dp[k-1][other]).',
  },
  tags: ['dp', 'paint-house', 'colors'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
