// Fibonacci Heap · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fibonacci-heap',
  categoryId: 'ds',
  title: { zh: '斐波那契堆', en: 'Fibonacci Heap' },
  summary: {
    zh: '斐波那契堆属于ds类别。',
    en: 'Fibonacci Heap is a ds algorithm.',
  },
  description: {
    zh: '斐波那契堆（Fibonacci Heap）属于ds类别的算法。',
    en: 'Fibonacci Heap is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(log n) 摊还', space: 'O(n)' },
};
