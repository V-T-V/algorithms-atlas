// Insertion Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'insertion-sort',
  categoryId: 'sorting',
  title: { zh: '插入排序', en: 'Insertion Sort' },
  summary: {
    zh: '插入排序属于sorting类别。',
    en: 'Insertion Sort is a sorting algorithm.',
  },
  description: {
    zh: '插入排序（Insertion Sort）属于sorting类别的算法。',
    en: 'Insertion Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
