// Pairing Heap · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pairing-heap',
  categoryId: 'ds',
  title: { zh: '配对堆', en: 'Pairing Heap' },
  summary: {
    zh: '配对堆属于ds类别。',
    en: 'Pairing Heap is a ds algorithm.',
  },
  description: {
    zh: '配对堆（Pairing Heap）属于ds类别的算法。',
    en: 'Pairing Heap is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(log n) 摊还', space: 'O(n)' },
};
