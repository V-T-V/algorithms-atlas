import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stock-8',
  categoryId: 'dp',
  title: { zh: '买卖股票（含手续费）', en: 'Best Time to Buy/Sell with Fee' },
  summary: {
    zh: '可多次买卖，每次卖出收手续费 fee，求最大利润。',
    en: 'Unlimited trades, pay fee per sell; max profit.',
  },
  description: {
    zh: 'hold=持有股票时的最大利润，cash=不持有时的最大利润。转移：hold=max(hold, cash-price)；cash=max(cash, hold+price-fee)。',
    en: 'State machine: hold=max(hold, cash-price); cash=max(cash, hold+price-fee).',
  },
  tags: ['dp', 'stock', 'transaction-fee'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
