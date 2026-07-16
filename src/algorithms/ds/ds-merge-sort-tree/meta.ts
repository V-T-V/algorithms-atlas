import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-merge-sort-tree',
  categoryId: 'ds',
  title: { zh: '归并排序树', en: 'Merge Sort Tree' },
  summary: {
    zh: '支持区间内“小于等于某值的元素个数”查询。',
    en: 'Supports "count of elements ≤ k in subarray" queries.',
  },
  description: {
    zh: '每节点存储对应区间的有序数组，查询时二分统计。建树 O(n log n)，查询 O(log² n)。',
    en: 'Each node stores sorted array of its segment; query via binary search. Build O(n log n), query O(log² n).',
  },
  tags: ['ds', 'segment-tree', 'sort'],
  complexity: { time: 'O(log²n) 查询', space: 'O(n log n)' },
};
