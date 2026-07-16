// Segment Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'segment-tree',
  categoryId: 'ds',
  title: { zh: '线段树', en: 'Segment Tree' },
  summary: {
    zh: '线段树属于ds类别。',
    en: 'Segment Tree is a ds algorithm.',
  },
  description: {
    zh: '线段树（Segment Tree）属于ds类别的算法。',
    en: 'Segment Tree is an algorithm in the ds category.',
  },
  tags: ["ds","tree","range-query"],
  complexity: { time: 'O(log n) 查询/更新，O(n) 建树', space: 'O(4n)' },
};
