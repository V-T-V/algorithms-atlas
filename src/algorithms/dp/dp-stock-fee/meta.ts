import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stock-fee',
  categoryId: 'dp',
  title: { zh: '含手续费股票', en: 'Best Time to Buy and Sell Stock with Transaction Fee' },
  summary: {
    zh: '无限次交易，但每笔交易需付固定手续费，求最大利润。',
    en: 'Unlimited trades, each with a fixed transaction fee; maximize profit.',
  },
  description: {
    zh: 'LeetCode 714。可无限次买卖，但每完成一笔交易（买入+卖出）需支付手续费 fee。状态机两态 DP：hold=当前持有最大收益，cash=当前不持有最大收益。转移 hold=max(hold, cash-prices[i])，cash=max(cash, hold+prices[i]-fee)（卖出时扣手续费）。初始 hold=-prices[0], cash=0。时间 O(n)，空间 O(1)。',
    en: 'LeetCode 714. Unlimited trades each paying a fixed fee. Two-state DP: hold=max(hold,cash-prices[i]), cash=max(cash,hold+prices[i]-fee). Answer=cash. Time O(n), space O(1).',
  },
  tags: ['dp', 'stock', 'state-machine', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
