import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-climb-stairs-3',
  categoryId: 'dp',
  title: { zh: '爬楼梯（变步长）', en: 'Climbing Stairs (Variable Steps)' },
  summary: {
    zh: '每次可走 steps 中任一阶，求到达第 n 阶的方案数。',
    en: 'Each time you may climb any step count in a set; count ways to reach stair n.',
  },
  description: {
    zh: '爬楼梯变种。给定台阶数 n 和允许步长集合 steps（如 {1,2,3}），每次可走 steps 中任一阶，求到达第 n 阶的方案数（顺序敏感，即排列数）。DP：dp[0]=1，dp[i]=Σdp[i-s]（对所有 s∈steps 且 s≤i）。时间 O(n·|steps|)，空间 O(n)。',
    en: 'Climbing stairs variant with allowed step set. dp[0]=1, dp[i]=sum of dp[i-s] over steps s<=i (order matters). Time O(n·|steps|), space O(n).',
  },
  tags: ['dp', 'combinatorics', 'sequence'],
  complexity: { time: 'O(n·|steps|)', space: 'O(n)' },
};
