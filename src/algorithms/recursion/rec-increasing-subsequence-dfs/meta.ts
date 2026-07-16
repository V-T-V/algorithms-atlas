// 最长递增子序列（DFS）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-increasing-subsequence-dfs',
  categoryId: 'recursion',
  title: { zh: '最长递增子序列（DFS+记忆化）', en: 'Longest Increasing Subsequence (DFS+Memo)' },
  summary: {
    zh: 'DFS 递归 lis(i) = 以 nums[i] 结尾的最长递增子序列长度，配记忆化 O(n²)。',
    en: 'DFS recursion lis(i) = length of LIS ending at nums[i], with memoization for O(n²).',
  },
  description: {
    zh: '最长递增子序列（LIS）的递归解法：定义 lis(i) 为以 nums[i] 结尾的 LIS 长度。lis(i) = 1 + max{ lis(j) : j<i 且 nums[j]<nums[i] }，无满足的 j 时为 1。整体答案 = max lis(i)。朴素递归 O(2^n)，加记忆化后 O(n²)。本实现用记忆化数组缓存每个 lis(i)。',
    en: 'Recursive solution for the Longest Increasing Subsequence (LIS): define lis(i) as the LIS length ending at nums[i]. lis(i) = 1 + max{ lis(j) : j<i and nums[j]<nums[i] }, or 1 if none qualifies. The answer is max lis(i). Naive recursion is O(2^n); with memoization it becomes O(n²). This implementation caches each lis(i) in a memo array.',
  },
  tags: ['recursion', 'lis', 'dfs', 'memoization', 'subsequence'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
