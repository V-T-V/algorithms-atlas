import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-combination-sum-iv',
  categoryId: 'dp',
  title: { zh: '组合总和 IV（排列数）', en: 'Combination Sum IV' },
  summary: {
    zh: '用 nums 凑成 target 的排列数（顺序不同算不同）。',
    en: 'Count permutations of nums that sum to target.',
  },
  description: {
    zh: 'LeetCode 377。给定正整数数组 nums 和目标 target，求由 nums 中元素（可重复）凑成 target 的不同排列数（顺序不同视为不同方案）。DP：dp[j] = 凑成 j 的排列数；外层枚举 target 1..target，内层枚举 nums：dp[j]+=dp[j-num]。外层 target 保证不同顺序都计数。时间 O(target·n)，空间 O(target)。',
    en: 'LeetCode 377. Count permutations of nums (with repetition) summing to target. dp[j]+=dp[j-num] with outer loop over target and inner over nums so different orders all count. Time O(target·n), space O(target).',
  },
  tags: ['dp', 'combinatorics', 'leetcode'],
  complexity: { time: 'O(target·n)', space: 'O(target)' },
};
