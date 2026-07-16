// Bitonic Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitonic-sort',
  categoryId: 'sorting',
  title: { zh: '双调排序', en: 'Bitonic Sort' },
  summary: {
    zh: '双调排序属于sorting类别。',
    en: 'Bitonic Sort is a sorting algorithm.',
  },
  description: {
    zh: '双调排序（Bitonic Sort）属于sorting类别的算法。',
    en: 'Bitonic Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting","bit-manipulation"],
  complexity: { time: 'O(n log²n)', space: 'O(n)' },
};
