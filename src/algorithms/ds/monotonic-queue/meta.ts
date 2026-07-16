// Monotonic Queue · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'monotonic-queue',
  categoryId: 'ds',
  title: { zh: '单调队列', en: 'Monotonic Queue' },
  summary: {
    zh: '单调队列属于ds类别。',
    en: 'Monotonic Queue is a ds algorithm.',
  },
  description: {
    zh: '单调队列（Monotonic Queue）属于ds类别的算法。',
    en: 'Monotonic Queue is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
