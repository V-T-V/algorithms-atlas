// Leftist Heap · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'leftist-heap',
  categoryId: 'ds',
  title: { zh: '左偏树', en: 'Leftist Heap' },
  summary: {
    zh: '左偏树属于ds类别。',
    en: 'Leftist Heap is a ds algorithm.',
  },
  description: {
    zh: '左偏树（Leftist Heap）属于ds类别的算法。',
    en: 'Leftist Heap is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
