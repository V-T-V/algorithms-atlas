// Chunk List · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'chunk-list',
  categoryId: 'ds',
  title: { zh: '块状链表', en: 'Chunk List' },
  summary: {
    zh: '块状链表属于ds类别。',
    en: 'Chunk List is a ds algorithm.',
  },
  description: {
    zh: '块状链表（Chunk List）属于ds类别的算法。',
    en: 'Chunk List is an algorithm in the ds category.',
  },
  tags: ["ds","dynamic-programming","linked-list"],
  complexity: { time: 'O(√n)', space: 'O(n)' },
};
