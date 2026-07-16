// Circular Queue · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'circular-queue',
  categoryId: 'ds',
  title: { zh: '循环队列', en: 'Circular Queue' },
  summary: {
    zh: '循环队列属于ds类别。',
    en: 'Circular Queue is a ds algorithm.',
  },
  description: {
    zh: '循环队列（Circular Queue）属于ds类别的算法。',
    en: 'Circular Queue is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(1) 入队/出队', space: 'O(capacity)' },
};
