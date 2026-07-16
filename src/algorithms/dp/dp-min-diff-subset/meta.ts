import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-min-diff-subset',
  categoryId: 'dp',
  title: { zh: '最小差子集分割', en: 'Minimum Subset Sum Difference' },
  summary: {
    zh: '把数组分成两个子集，使两子集和的差的绝对值最小。',
    en: 'Partition an array into two subsets to minimize the absolute difference of their sums.',
  },
  description: {
    zh: '给定正整数数组 nums，将其划分为两个子集 S1、S2（并集为全集，可不均分），最小化 |sum(S1)-sum(S2)|。记总和 sum、半和 half=⌊sum/2⌋。用 0/1 背包求出不超过 half 的最大可达子集和 s1，则另一子集和 sum-s1，差 = sum-2·s1。用布尔 dp[j] 表示「子集和 j 是否可达」，滚动更新。时间 O(n·sum)，空间 O(sum)。',
    en: 'Partition positive array nums into two subsets S1,S2 minimizing |sum(S1)-sum(S2)|. Let total=sum, half=⌊sum/2⌋. Use 0/1 knapsack to find the largest reachable subset sum s1 ≤ half; answer = sum-2·s1. dp[j] = whether sum j is reachable. Time O(n·sum), space O(sum).',
  },
  tags: ['dp', 'knapsack', 'partition'],
  complexity: { time: 'O(n·sum)', space: 'O(sum)' },
};
