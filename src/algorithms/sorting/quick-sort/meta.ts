// Quick Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quick-sort',
  categoryId: 'sorting',
  title: { zh: '快速排序', en: 'Quick Sort' },
  summary: {
    zh: '快速排序属于sorting类别。',
    en: 'Quick Sort is a sorting algorithm.',
  },
  description: {
    zh: '快速排序（Quick Sort）属于sorting类别的算法。',
    en: 'Quick Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};
