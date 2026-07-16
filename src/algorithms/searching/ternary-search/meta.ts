// Ternary Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ternary-search',
  categoryId: 'searching',
  title: { zh: '三分查找', en: 'Ternary Search' },
  summary: {
    zh: '三分查找属于searching类别。',
    en: 'Ternary Search is a searching algorithm.',
  },
  description: {
    zh: '三分查找（Ternary Search）属于searching类别的算法。',
    en: 'Ternary Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
