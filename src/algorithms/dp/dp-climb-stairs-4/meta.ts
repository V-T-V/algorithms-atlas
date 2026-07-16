import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-climb-stairs-4',
  categoryId: 'dp',
  title: { zh: '爬楼梯（带障碍）', en: 'Climbing Stairs with Obstacles' },
  summary: {
    zh: '每次可爬 1 或 2 阶，但某些台阶是障碍不能踩，求到达顶部的方案数。',
    en: 'Climb 1 or 2 steps, but avoid obstacle steps; count distinct ways to the top.',
  },
  description: {
    zh: 'LeetCode 70 变体。dp[i] = 到达第 i 阶的方案数。dp[i] = dp[i-1] + dp[i-2]；若 i 为障碍则 dp[i]=0。初始 dp[0]=1。',
    en: 'Variant of LC 70. dp[i] = ways to reach step i. dp[i]=dp[i-1]+dp[i-2]; 0 if obstacle; dp[0]=1.',
  },
  tags: ['dp', 'climb-stairs', 'obstacle'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
