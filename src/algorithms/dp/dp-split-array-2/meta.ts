import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-split-array-2',
  categoryId: 'dp',
  title: { zh: '分割数组最大和（二分答案）', en: 'Split Array Largest Sum (Binary Search)' },
  summary: {
    zh: '将数组分成 m 个连续段，最小化最大段和。用二分答案求解。',
    en: 'Split array into m contiguous subarrays to minimize the largest sum; via binary search on the answer.',
  },
  description: {
    zh: 'LeetCode 410。二分枚举上限 limit，贪心检查能否在 m 段内每段和 ≤ limit。若可行则下调，否则上调。最终得到最小可行 limit。',
    en: 'LC 410. Binary search on max sum limit; greedy feasibility check whether m groups suffice under that limit.',
  },
  tags: ['dp', 'binary-search', 'greedy'],
  complexity: { time: 'O(n log S)', space: 'O(1)' },
};
