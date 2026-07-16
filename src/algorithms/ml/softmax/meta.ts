// Softmax · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'softmax',
  categoryId: 'ml',
  title: { zh: 'Softmax回归', en: 'Softmax' },
  summary: {
    zh: 'Softmax回归属于ml类别。',
    en: 'Softmax is a ml algorithm.',
  },
  description: {
    zh: 'Softmax回归（Softmax）属于ml类别的算法。',
    en: 'Softmax is an algorithm in the ml category.',
  },
  tags: ["ml"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
