// Meta Binary Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'meta-binary',
  categoryId: 'searching',
  title: { zh: '元二分查找', en: 'Meta Binary Search' },
  summary: {
    zh: '元二分查找属于searching类别。',
    en: 'Meta Binary Search is a searching algorithm.',
  },
  description: {
    zh: '元二分查找（Meta Binary Search）属于searching类别的算法。',
    en: 'Meta Binary Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
