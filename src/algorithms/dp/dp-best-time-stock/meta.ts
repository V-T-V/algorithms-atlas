import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-best-time-stock',
  categoryId: 'dp',
  title: { zh: '买卖股票最佳时机（单次）', en: 'Best Time to Buy and Sell Stock (Once)' },
  summary: {
    zh: '只允许一次买入一次卖出，求最大利润。',
    en: 'At most one buy and one sell; maximize profit.',
  },
  description: {
    zh: 'LeetCode 121。给定 N 天价格 prices，只能买卖一次（先买后卖），求最大利润（不能获利则 0）。维护到第 i 天为止的最低价 minPrice，利润 = prices[i]-minPrice，取最大。等价 DP：dp = max(dp, prices[i]-minPrice)，minPrice=min(minPrice,prices[i])。时间 O(n)，空间 O(1)。',
    en: 'LeetCode 121. With at most one transaction (buy then sell), maximize profit (≥0). Track the running min price; profit on day i = prices[i]-minPrice; keep the max. Time O(n), space O(1).',
  },
  tags: ['dp', 'stock', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
