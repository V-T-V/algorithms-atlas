// Bubble Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bubble-sort',
  categoryId: 'sorting',
  title: { zh: '冒泡排序', en: 'Bubble Sort' },
  summary: {
    zh: '冒泡排序属于sorting类别。',
    en: 'Bubble Sort is a sorting algorithm.',
  },
  description: {
    zh: '冒泡排序（Bubble Sort）属于sorting类别的算法。',
    en: 'Bubble Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
