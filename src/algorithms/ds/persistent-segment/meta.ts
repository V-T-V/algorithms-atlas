// Persistent Segment Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'persistent-segment',
  categoryId: 'ds',
  title: { zh: '可持久化线段树', en: 'Persistent Segment Tree' },
  summary: {
    zh: '可持久化线段树属于ds类别。',
    en: 'Persistent Segment Tree is a ds algorithm.',
  },
  description: {
    zh: '可持久化线段树（Persistent Segment Tree）属于ds类别的算法。',
    en: 'Persistent Segment Tree is an algorithm in the ds category.',
  },
  tags: ["ds","range-query"],
  complexity: { time: 'O(log n)', space: 'O((n+q) log n)' },
};
