import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-lis-5',
  categoryId: 'dp',
  title: {
    zh: '最长递增子序列（贪心+二分）',
    en: 'Longest Increasing Subsequence (Binary Search)',
  },
  summary: {
    zh: 'O(n log n) 贪心二分求最长严格递增子序列长度。',
    en: 'O(n log n) greedy + binary search for LIS length.',
  },
  description: {
    zh: '维护一个尾数数组 tails，tails[k] 为长度 k+1 的递增子序列的最小尾数。每读入 x，在 tails 中二分第一个 >=x 的位置并替换（严格递增用 lower_bound），最终 tails 长度即为 LIS。',
    en: 'Maintain tails array where tails[k] = smallest tail of an increasing subsequence of length k+1. For each x, binary search first >= x and replace. Length of tails = LIS length.',
  },
  tags: ['dp', 'lis', 'binary-search'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
