// Splay Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'splay-ds',
  categoryId: 'ds',
  title: { zh: '伸展树', en: 'Splay Tree' },
  summary: {
    zh: '伸展树属于ds类别。',
    en: 'Splay Tree is a ds algorithm.',
  },
  description: {
    zh: '伸展树（Splay Tree）属于ds类别的算法。',
    en: 'Splay Tree is an algorithm in the ds category.',
  },
  tags: ["ds","tree"],
  complexity: { time: 'O(log n) 摊还', space: 'O(n)' },
};
