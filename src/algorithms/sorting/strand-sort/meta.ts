// Strand Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'strand-sort',
  categoryId: 'sorting',
  title: { zh: 'Strand 排序', en: 'Strand Sort' },
  summary: {
    zh: 'Strand 排序属于sorting类别。',
    en: 'Strand Sort is a sorting algorithm.',
  },
  description: {
    zh: 'Strand 排序（Strand Sort）属于sorting类别的算法。',
    en: 'Strand Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
