import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-warehouse',
  categoryId: 'dp',
  title: { zh: '仓库调度', en: 'Warehouse Scheduling' },
  summary: {
    zh: 'N 天销售商品，每日可进货或卖货但只能选其一，求最大利润。',
    en: 'Sell goods over N days; each day either buy or sell exactly one unit; maximize profit.',
  },
  description: {
    zh: '给定 N 天的商品价格 price[i]。每天要么买入 1 件（花费 price[i]），要么卖出已持有的 1 件（收入 price[i]），要么不操作；任意时刻最多持有一件商品。求最大利润。状态机 DP：hold = 当前持有 1 件的最大累计收益，cash = 当前不持有的最大累计收益。初始 cash=0, hold=-price[0]；转移 cash=max(cash, hold+price[i]), hold=max(hold, cash-price[i])。答案 = cash。时间 O(n)。',
    en: 'Given N-day prices, each day buy 1 unit (-price[i]), sell 1 held unit (+price[i]), or idle; hold at most 1 unit. State-machine DP: hold = best profit while holding, cash = best while empty. cash=max(cash,hold+price[i]), hold=max(hold,cash-price[i]). Answer = cash. Time O(n).',
  },
  tags: ['dp', 'state-machine', 'greedy'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
