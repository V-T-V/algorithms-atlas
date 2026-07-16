// Exponential Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'exponential-search',
  categoryId: 'searching',
  title: { zh: '指数搜索', en: 'Exponential Search' },
  summary: {
    zh: '指数搜索属于searching类别。',
    en: 'Exponential Search is a searching algorithm.',
  },
  description: {
    zh: '指数搜索（Exponential Search）属于searching类别的算法。',
    en: 'Exponential Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
