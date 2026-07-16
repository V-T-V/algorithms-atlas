import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stock-cooldown',
  categoryId: 'dp',
  title: { zh: '含冷冻期股票', en: 'Best Time to Buy and Sell Stock with Cooldown' },
  summary: {
    zh: '卖出后次日必须冷冻一天，求最大利润。',
    en: 'After selling you must cool down one day; maximize profit.',
  },
  description: {
    zh: 'LeetCode 309。可无限次交易，但卖出股票后第二天不能买入（冷冻期）。状态机三态 DP：hold=当前持有最大收益，sold=当天卖出（次日进入冷冻）最大收益，rest=当天处于冷冻/未持有且可买最大收益。转移：hold=max(hold, rest-p), sold=hold_prev+p, rest=max(rest, sold_prev)。时间 O(n)，空间 O(1)。',
    en: 'LeetCode 309. Unlimited trades but a one-day cooldown after selling. Three-state DP: hold=max(hold,rest-p), sold=hold_prev+p, rest=max(rest,sold_prev). Time O(n), space O(1).',
  },
  tags: ['dp', 'stock', 'state-machine', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
