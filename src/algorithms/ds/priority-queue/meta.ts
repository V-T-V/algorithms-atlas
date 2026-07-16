// Priority Queue · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'priority-queue',
  categoryId: 'ds',
  title: { zh: '优先队列', en: 'Priority Queue' },
  summary: {
    zh: '优先队列属于ds类别。',
    en: 'Priority Queue is a ds algorithm.',
  },
  description: {
    zh: '优先队列（Priority Queue）属于ds类别的算法。',
    en: 'Priority Queue is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure","scheduling"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
