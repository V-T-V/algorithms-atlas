// Library Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'library-sort',
  categoryId: 'sorting',
  title: { zh: '图书馆排序', en: 'Library Sort' },
  summary: {
    zh: '图书馆排序属于sorting类别。',
    en: 'Library Sort is a sorting algorithm.',
  },
  description: {
    zh: '图书馆排序（Library Sort）属于sorting类别的算法。',
    en: 'Library Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
