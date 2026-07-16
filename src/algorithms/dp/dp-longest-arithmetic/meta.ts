import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-longest-arithmetic',
  categoryId: 'dp',
  title: { zh: '最长等差数列', en: 'Longest Arithmetic Subsequence' },
  summary: {
    zh: 'DP 求（可重排选取的）最长等差子序列长度。',
    en: 'DP for the longest arithmetic subsequence length.',
  },
  description: {
    zh: '给定整数数组 nums，求其中最长的等差子序列（保持原顺序，公差任意，含负）的长度。状态 dp[i][d] 表示以 nums[i] 结尾、公差为 d 的最长等差子序列长度。对每对 j<i，令 d=nums[i]-nums[j]，则 dp[i][d] = dp[j][d]+1（不存在则为 2）。用嵌套 Map 实现。时间 O(n²)。',
    en: 'Given an integer array, find the longest arithmetic subsequence (preserving order, any common difference including negative). State dp[i][d] = longest arithmetic subsequence ending at nums[i] with difference d. For each j<i, let d=nums[i]-nums[j], then dp[i][d] = dp[j][d]+1 (or 2 if new). Implemented with nested Maps. Time O(n²).',
  },
  tags: ['dp', 'subsequence', 'arithmetic', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
