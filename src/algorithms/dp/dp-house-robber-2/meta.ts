import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-house-robber-2',
  categoryId: 'dp',
  title: { zh: '打家劫舍 II', en: 'House Robber II' },
  summary: {
    zh: '环形排列首尾相邻，拆成两段线性子问题取最大。',
    en: 'Circular layout: split into two linear ranges and take the max.',
  },
  description: {
    zh: '房屋围成一圈，首尾相邻，不能同时抢第一间和最后一间。由于第一间和最后一间互斥，问题可拆为两个线性打家劫舍：(1) 只考虑 [0, n-2]；(2) 只考虑 [1, n-1]，两者取较大值即答案。每个子问题用 dp[i] = max(dp[i-1], dp[i-2]+nums[i])。时间 O(n)。',
    en: 'Houses form a circle, so the first and last are adjacent and cannot both be robbed. Since they are mutually exclusive, split into two linear subproblems: [0, n-2] and [1, n-1], taking the max. Each uses dp[i] = max(dp[i-1], dp[i-2]+nums[i]). Time O(n).',
  },
  tags: ['dp', 'linear', 'circular', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
