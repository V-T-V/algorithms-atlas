import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-lis-4',
  categoryId: 'dp',
  title: { zh: 'LIS 二分（O(n log n)）', en: 'LIS via Binary Search (O(n log n))' },
  summary: {
    zh: '用「牌堆」二分法求最长递增子序列长度，时间复杂度降为 O(n log n)。',
    en: 'Patience sorting: binary search on piles to compute LIS length in O(n log n).',
  },
  description: {
    zh: '维护一个递增数组 tails，tails[k] 为「长度为 k+1 的递增子序列的最小结尾」。对每个 x：用二分找到第一个 tails[k]>=x 的位置并替换之；若 x 大于所有 tails 则追加。最终 tails.length 即为 LIS 长度。比朴素 O(n²) DP 更快。',
    en: 'Maintain tails[] where tails[k] is the smallest tail of any increasing subsequence of length k+1. For each x, binary-search the first tails[k]>=x and replace; append if x beats all. tails.length gives LIS length.',
  },
  tags: ['dp', 'lis', 'binary-search', 'patience'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
