// Deque · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'deque',
  categoryId: 'ds',
  title: { zh: '双端队列', en: 'Deque' },
  summary: {
    zh: '双端队列属于ds类别。',
    en: 'Deque is a ds algorithm.',
  },
  description: {
    zh: '双端队列（Deque）属于ds类别的算法。',
    en: 'Deque is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
