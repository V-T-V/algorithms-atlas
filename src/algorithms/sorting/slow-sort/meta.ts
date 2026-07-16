// Slow Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'slow-sort',
  categoryId: 'sorting',
  title: { zh: '慢排序', en: 'Slow Sort' },
  summary: {
    zh: '慢排序属于sorting类别。',
    en: 'Slow Sort is a sorting algorithm.',
  },
  description: {
    zh: '慢排序（Slow Sort）属于sorting类别的算法。',
    en: 'Slow Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n^(log n))', space: 'O(n)' },
};
