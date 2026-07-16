import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-find-length',
  categoryId: 'dp',
  title: { zh: '最长重复子数组', en: 'Maximum Length of Repeated Subarray' },
  summary: {
    zh: '求两个数组的最长公共连续子数组长度。',
    en: 'Find the length of the longest common contiguous subarray of two arrays.',
  },
  description: {
    zh: 'LeetCode 718。给定两个整数数组 nums1、nums2，求最长的公共连续子数组（元素完全相同的连续段）长度。DP：dp[i][j] = 以 nums1[i-1]、nums2[j-1] 结尾的最长公共子数组长度；若相等 dp[i][j]=dp[i-1][j-1]+1，否则 0。答案为 dp 表最大值。可滚动数组压缩到 O(min(m,n)) 空间，倒序更新。时间 O(mn)。',
    en: 'LeetCode 718. Find the longest common contiguous subarray of nums1 and nums2. dp[i][j] = longest common subarray ending at nums1[i-1],nums2[j-1]; if equal dp[i][j]=dp[i-1][j-1]+1 else 0; answer = max over the table. Rolling to O(min(m,n)). Time O(mn).',
  },
  tags: ['dp', 'subarray', 'leetcode'],
  complexity: { time: 'O(mn)', space: 'O(min(m,n))' },
};
