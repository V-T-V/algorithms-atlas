// Stooge Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stooge-sort',
  categoryId: 'sorting',
  title: { zh: 'Stooge 排序', en: 'Stooge Sort' },
  summary: {
    zh: 'Stooge 排序属于sorting类别。',
    en: 'Stooge Sort is a sorting algorithm.',
  },
  description: {
    zh: 'Stooge 排序（Stooge Sort）属于sorting类别的算法。',
    en: 'Stooge Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n^2.71)', space: 'O(n)' },
};
