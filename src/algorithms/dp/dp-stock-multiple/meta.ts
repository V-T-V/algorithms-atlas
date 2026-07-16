import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stock-multiple',
  categoryId: 'dp',
  title: { zh: '买卖股票（多次）', en: 'Best Time to Buy and Sell Stock II' },
  summary: {
    zh: '允许多次买卖（同时最多持有一股），求最大利润。',
    en: 'Unlimited transactions but hold at most one share; maximize profit.',
  },
  description: {
    zh: 'LeetCode 122。可进行任意次买卖，但同一时刻最多持有一股（卖出后才能再买）。贪心：只要今天比昨天高就把差价计入利润——把所有上涨段累加即等于多次买卖的最优收益。状态机 DP 等价：hold=max(hold, cash-prices[i])，cash=max(cash, hold+prices[i])。时间 O(n)，空间 O(1)。',
    en: 'LeetCode 122. Unlimited trades, at most one share held. Greedy: sum every positive day-to-day gain, which equals the optimal multi-trade profit. Equivalent state DP: hold=max(hold,cash-prices[i]), cash=max(cash,hold+prices[i]). Time O(n), space O(1).',
  },
  tags: ['dp', 'stock', 'greedy', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
