import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-coin-change-count',
  categoryId: 'dp',
  title: { zh: '零钱兑换组合数', en: 'Coin Change II' },
  summary: {
    zh: '用若干面额凑成总金额的组合数（不计顺序）。',
    en: 'Count combinations of coins that sum to a target amount.',
  },
  description: {
    zh: 'LeetCode 518。给定硬币面额 coins 和总金额 amount，求凑成 amount 的组合数（不同硬币可无限使用，顺序不同的同一组硬币算一种）。完全背包组合数：外层枚举硬币 coin，内层 amount 从 coin 到 amount 正序更新 dp[j]+=dp[j-coin]。外层硬币保证不重复计数。时间 O(n·amount)，空间 O(amount)。',
    en: 'LeetCode 518. Count coin combinations summing to amount (unlimited use, order-agnostic). Unbounded knapsack counting: outer loop over coins, inner loop amount ascending: dp[j]+=dp[j-coin]. Time O(n·amount), space O(amount).',
  },
  tags: ['dp', 'knapsack', 'combinatorics', 'leetcode'],
  complexity: { time: 'O(n·amount)', space: 'O(amount)' },
};
