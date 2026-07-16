import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stock-7',
  categoryId: 'dp',
  title: { zh: '买卖股票 VII（含冷冻期）', en: 'Best Time Buy/Sell Stock VII (Cooldown)' },
  summary: {
    zh: '无限次交易但卖出后次日不能买入（冷冻期），求最大利润。',
    en: 'Unlimited trades with a 1-day cooldown after selling; maximize profit.',
  },
  description: {
    zh: 'LeetCode 309。三态状态机：hold（持有）、cash（不持有且非冷冻）、cool（冷冻）。cool = hold+price（今日卖出）；cash=max(cash, cool)（冷冻解除）；hold=max(hold, cash-price)（仅 cash 态可买入）。',
    en: 'LC 309. Three states hold/cash/cool. cool=hold+price; cash=max(cash,cool); hold=max(hold,cash-price).',
  },
  tags: ['dp', 'stock', 'state-machine', 'cooldown'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
