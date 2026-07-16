import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-merge-tree-2',
  categoryId: 'ds',
  title: { zh: '归并树（线段树+排序）', en: 'Merge Sort Tree' },
  summary: {
    zh: '每个区间维护排序后的数组，支持区间第 k 小 / 区间内 <= x 计数。',
    en: 'Each segment stores a sorted subarray; supports range k-th smallest / range <= x count.',
  },
  description: {
    zh: '用线段树组织区间，每个节点存该区间的有序数组。查询二分+合并。',
    en: 'Segment tree whose nodes hold sorted subarrays; queries use binary search + merge.',
  },
  tags: ['ds', 'merge-sort-tree', 'segment-tree'],
  complexity: { time: 'O(log^2 n)', space: 'O(n log n)' },
};
