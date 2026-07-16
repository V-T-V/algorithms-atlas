import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-segment-point',
  categoryId: 'ds',
  title: { zh: '线段树（单点更新）', en: 'Segment Tree (Point Update)' },
  summary: {
    zh: '单点更新 + 区间求和的线段树。',
    en: 'Point update + range sum segment tree.',
  },
  description: {
    zh: '数组存储，叶为单元素，内部为子段和。更新 O(log n)，查询 O(log n)。',
    en: 'Array storage; leaves are single elements; internal = subtree sum. Update/query O(log n).',
  },
  tags: ['ds', 'segment-tree', 'range-query'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
