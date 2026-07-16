// KD-Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kd-tree',
  categoryId: 'ds',
  title: { zh: 'KD树', en: 'KD-Tree' },
  summary: {
    zh: 'KD树属于ds类别。',
    en: 'KD-Tree is a ds algorithm.',
  },
  description: {
    zh: 'KD树（KD-Tree）属于ds类别的算法。',
    en: 'KD-Tree is an algorithm in the ds category.',
  },
  tags: ["ds","tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
