import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-number-of-longest',
  categoryId: 'dp',
  title: { zh: '最长递增子序列个数', en: 'Number of Longest Increasing Subsequence' },
  summary: {
    zh: '求数组最长严格递增子序列的个数。',
    en: 'Count the number of longest strictly increasing subsequences.',
  },
  description: {
    zh: 'LeetCode 673。给定数组 nums，求最长严格递增子序列（LIS）的个数。双 DP：length[i] = 以 nums[i] 结尾的 LIS 长度，count[i] = 其个数。对每对 j<i 且 nums[j]<nums[i]：若 length[j]+1>length[i] 则更新长度并重置 count[i]=count[j]；若相等则 count[i]+=count[j]。最终统计所有达到最大长度的 count 之和。时间 O(n²)，空间 O(n)。',
    en: 'LeetCode 673. Count the number of longest strictly increasing subsequences. length[i] = LIS length ending at i, count[i] = its count. For j<i with nums[j]<nums[i]: if length[j]+1>length[i] reset count[i]=count[j]; if equal count[i]+=count[j]. Sum counts reaching the max length. Time O(n²), space O(n).',
  },
  tags: ['dp', 'lis', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
