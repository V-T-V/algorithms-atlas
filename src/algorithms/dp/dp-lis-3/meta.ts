import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-lis-3',
  categoryId: 'dp',
  title: { zh: 'LIS 计数（方案数）', en: 'Number of Longest Increasing Subsequences' },
  summary: {
    zh: '求最长递增子序列的长度并统计达到该长度的子序列个数。',
    en: 'Find LIS length and count how many distinct LIS achieve it.',
  },
  description: {
    zh: 'LeetCode 673。给定数组 nums，求最长递增子序列（LIS）的长度，并统计有多少个不同的 LIS 达到此长度。DP：len[i] 为以 nums[i] 结尾的 LIS 长度，cnt[i] 为对应方案数。转移时对所有 j<i 且 nums[j]<nums[i]：若 len[j]+1>len[i] 则更新长度与计数；若相等则累加计数。最后统计所有 len[i]==maxLen 的 cnt[i] 之和。时间 O(n²)，空间 O(n)。',
    en: 'LeetCode 673. Given nums, find LIS length and count distinct LIS reaching it. DP: len[i]=LIS length ending at i, cnt[i]=number of ways. For j<i with nums[j]<nums[i]: update length/count accordingly. Time O(n²), space O(n).',
  },
  tags: ['dp', 'lis', 'counting', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
