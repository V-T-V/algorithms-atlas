// Binary Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binary-search',
  categoryId: 'searching',
  title: { zh: '二分查找', en: 'Binary Search' },
  summary: {
    zh: '二分查找属于searching类别。',
    en: 'Binary Search is a searching algorithm.',
  },
  description: {
    zh: '二分查找（Binary Search）属于searching类别的算法。',
    en: 'Binary Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
