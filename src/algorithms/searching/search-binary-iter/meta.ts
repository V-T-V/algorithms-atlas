// 二分查找（迭代标准） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-binary-iter',
  categoryId: 'searching',
  title: { zh: '二分查找（迭代标准）', en: 'Binary Search (Iterative Standard)' },
  summary: {
    zh: '标准迭代二分：命中即返回，时间 O(log n)。',
    en: 'Standard iterative binary search; return on hit, O(log n).',
  },
  description: {
    zh: '标准迭代二分查找：在升序数组中取中点 mid，命中返回；target 较大向右 lo=mid+1，较小向左 hi=mid-1；lo>hi 时未命中返回 -1。这是最经典的二分写法，时间 O(log n)，空间 O(1)。',
    en: 'Standard iterative binary search: take the midpoint mid in a sorted array; return on hit; if target is larger go right (lo=mid+1), smaller go left (hi=mid-1); when lo>hi return -1 (miss). The most classic binary search form. Time O(log n), space O(1).',
  },
  tags: ['searching', 'binary-search', 'iterative', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
