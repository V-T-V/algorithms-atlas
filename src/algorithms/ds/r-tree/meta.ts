// R-Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'r-tree',
  categoryId: 'ds',
  title: { zh: 'R树', en: 'R-Tree' },
  summary: {
    zh: 'R树属于ds类别。',
    en: 'R-Tree is a ds algorithm.',
  },
  description: {
    zh: 'R树（R-Tree）属于ds类别的算法。',
    en: 'R-Tree is an algorithm in the ds category.',
  },
  tags: ["ds","tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
