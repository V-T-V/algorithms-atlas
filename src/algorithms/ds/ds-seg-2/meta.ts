import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-seg-2',
  categoryId: 'ds',
  title: { zh: '线段树（区间加+区间和）', en: 'Segment Tree (Range Add + Range Sum)' },
  summary: {
    zh: '支持区间加、区间和查询，O(log n) 单次操作。',
    en: 'Range-add updates and range-sum queries, both O(log n).',
  },
  description: {
    zh: '使用 lazy 标记延迟下传，叶子维护单点值，内部节点维护区间和。',
    en: 'Lazy tags defer propagation; leaves hold point values, internal nodes hold range sums.',
  },
  tags: ['ds', 'segment-tree', 'lazy'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
