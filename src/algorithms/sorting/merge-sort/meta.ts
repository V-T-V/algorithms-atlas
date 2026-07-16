// Merge Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'merge-sort',
  categoryId: 'sorting',
  title: { zh: '归并排序', en: 'Merge Sort' },
  summary: {
    zh: '归并排序属于sorting类别。',
    en: 'Merge Sort is a sorting algorithm.',
  },
  description: {
    zh: '归并排序（Merge Sort）属于sorting类别的算法。',
    en: 'Merge Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
