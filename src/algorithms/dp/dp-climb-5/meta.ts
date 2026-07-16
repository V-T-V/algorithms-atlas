import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-climb-5',
  categoryId: 'dp',
  title: { zh: '爬楼梯（最多 k 步）', en: 'Climbing Stairs (up to k steps)' },
  summary: {
    zh: '每次可爬 1..k 阶，求到达顶部的方案数。',
    en: 'Climb 1..k steps each move; count distinct ways to top.',
  },
  description: {
    zh: 'dp[i]=dp[i-1]+...+dp[i-k]（前缀和加速到 O(n)）。dp[0]=1。',
    en: 'dp[i]=sum of dp[i-1..i-k]; use sliding window sum for O(n). dp[0]=1.',
  },
  tags: ['dp', 'climb-stairs', 'sliding-window'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
