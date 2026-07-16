import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-stock-5',
  categoryId: 'dp',
  title: { zh: '买卖股票含冷冻期', en: 'Best Time to Buy and Sell Stock with Cooldown' },
  summary: {
    zh: '卖出后次日不能买入（冷冻期），求最大利润，可无限次交易。',
    en: 'Unlimited trades but a one-day cooldown after selling; maximize profit.',
  },
  description: {
    zh: 'LeetCode 309。给定每日股价 prices，可完成任意多笔交易，但卖出后第二天不能买入（冷冻期 1 天）。状态机 DP：hold[i]=第 i 天结束时持有股票的最大利润=max(hold[i-1], rest[i-1]-prices[i])（继续持有或今天买入，买入前必为 rest）；sold[i]=今天卖出=hold[i-1]+prices[i]；rest[i]=max(rest[i-1], sold[i-1])（不动或昨天刚卖今天冷却）。初值 hold[0]=-prices[0], sold[0]=0, rest[0]=0。答案=max(rest[n-1], sold[n-1])。时间 O(n)，空间 O(1)（滚动）。',
    en: 'LeetCode 309. State machine: hold/sold/rest. hold=max(hold,rest-price); sold=hold+price; rest=max(rest,sold_prev). Answer max(rest,sold). Time O(n), space O(1).',
  },
  tags: ['dp', 'stock', 'state-machine', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
