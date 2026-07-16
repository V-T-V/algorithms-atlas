// Pigeonhole Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pigeonhole-sort',
  categoryId: 'sorting',
  title: { zh: '鸽巢排序', en: 'Pigeonhole Sort' },
  summary: {
    zh: '鸽巢排序属于sorting类别。',
    en: 'Pigeonhole Sort is a sorting algorithm.',
  },
  description: {
    zh: '鸽巢排序（Pigeonhole Sort）属于sorting类别的算法。',
    en: 'Pigeonhole Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n + range)', space: 'O(range)' },
};
