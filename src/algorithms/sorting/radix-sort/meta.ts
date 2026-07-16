// Radix Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'radix-sort',
  categoryId: 'sorting',
  title: { zh: '基数排序', en: 'Radix Sort' },
  summary: {
    zh: '基数排序属于sorting类别。',
    en: 'Radix Sort is a sorting algorithm.',
  },
  description: {
    zh: '基数排序（Radix Sort）属于sorting类别的算法。',
    en: 'Radix Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(d · (n + b))', space: 'O(n + b)' },
};
