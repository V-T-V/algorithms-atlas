import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stock-6',
  categoryId: 'dp',
  title: { zh: '买卖股票 VI（带手续费）', en: 'Best Time Buy/Sell Stock VI (with Fee)' },
  summary: {
    zh: '可无限次交易，但每次卖出需交固定手续费，求最大利润。',
    en: 'Unlimited trades, each sell incurs a fixed transaction fee; maximize profit.',
  },
  description: {
    zh: 'LeetCode 714。状态机 DP：hold = 持有股票时的最大现金；cash = 不持有时的最大现金。cash=max(cash, hold+price-fee)；hold=max(hold, cash-price)。',
    en: 'LC 714. State machine: hold/cash. cash=max(cash,hold+price-fee); hold=max(hold,cash-price).',
  },
  tags: ['dp', 'stock', 'state-machine', 'fee'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
