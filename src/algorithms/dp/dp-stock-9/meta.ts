import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stock-9',
  categoryId: 'dp',
  title: { zh: '买卖股票（含冷冻期）', en: 'Best Time to Buy/Sell with Cooldown' },
  summary: {
    zh: '多次买卖，卖出后第二天不能买入（冷冻期 1 天），求最大利润。',
    en: 'Unlimited trades, 1-day cooldown after sell; max profit.',
  },
  description: {
    zh: '三状态机：hold（持有）、cash（不持有可买）、cool（冷冻，刚卖出）。cool=max(hold+p)；hold=max(hold, cash-p)；cash=max(cash, cool)。',
    en: 'Three states: hold/cash/cool. cool=max(hold+p); hold=max(hold,cash-p); cash=max(cash,cool).',
  },
  tags: ['dp', 'stock', 'cooldown'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
