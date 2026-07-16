// Treap · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'treap',
  categoryId: 'ds',
  title: { zh: '树堆', en: 'Treap' },
  summary: {
    zh: '树堆属于ds类别。',
    en: 'Treap is a ds algorithm.',
  },
  description: {
    zh: '树堆（Treap）属于ds类别的算法。',
    en: 'Treap is an algorithm in the ds category.',
  },
  tags: ["ds","tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
