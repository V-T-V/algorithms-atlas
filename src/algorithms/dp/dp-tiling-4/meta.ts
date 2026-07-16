import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-tiling-4',
  categoryId: 'dp',
  title: { zh: '多米诺铺砖（2×N）', en: 'Domino Tiling 2×N' },
  summary: {
    zh: '用 1×2 多米诺骨牌铺满 2×N 网格的方案数（斐波那契）。',
    en: 'Number of ways to tile a 2×N board with 1×2 dominoes (Fibonacci).',
  },
  description: {
    zh: 'dp[i]=铺满 2×i 的方案数。dp[i]=dp[i-1]+dp[i-2]（竖放一根 或 横放两根）。dp[0]=1, dp[1]=1。',
    en: 'dp[i]=dp[i-1]+dp[i-2]. dp[0]=1, dp[1]=1.',
  },
  tags: ['dp', 'tiling', 'fibonacci'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
