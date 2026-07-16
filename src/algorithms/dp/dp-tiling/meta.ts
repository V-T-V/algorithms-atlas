// Tiling DP · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-tiling',
  categoryId: 'dp',
  title: { zh: '铺砖·2×N 用 1×2', en: 'Tiling 2×N with 1×2' },
  summary: {
    zh: '用 1×2 砖铺满 2×N 通道的方案数（斐波那契）。',
    en: 'Number of ways to tile a 2×N corridor with 1×2 dominoes (Fibonacci).',
  },
  description: {
    zh: '用 1×2 多米诺砖（可横放或竖放）铺满 2×N 的网格，求方案数。dp[n] = dp[n-1] + dp[n-2]：考虑最左列，竖放一块占 1 列（剩 dp[n-1]），或两块横放占 2 列（剩 dp[n-2]）。即斐波那契数列。dp[0]=1, dp[1]=1。时间 O(n)。',
    en: 'Tile a 2×N grid with 1×2 dominoes (horizontal or vertical). dp[n] = dp[n-1] + dp[n-2]: at the leftmost column, place one vertical domino (leaving dp[n-1]) or two horizontal dominoes (leaving dp[n-2]). This is the Fibonacci sequence. dp[0]=1, dp[1]=1. Time O(n).',
  },
  tags: ['dp', 'tiling', 'fibonacci', 'counting'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
