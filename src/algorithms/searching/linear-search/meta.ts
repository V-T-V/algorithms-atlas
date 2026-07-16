// Linear Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'linear-search',
  categoryId: 'searching',
  title: { zh: '线性查找', en: 'Linear Search' },
  summary: {
    zh: '线性查找属于searching类别。',
    en: 'Linear Search is a searching algorithm.',
  },
  description: {
    zh: '线性查找（Linear Search）属于searching类别的算法。',
    en: 'Linear Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
