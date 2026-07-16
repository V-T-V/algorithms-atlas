// Interpolation Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'interpolation-search',
  categoryId: 'searching',
  title: { zh: '插值搜索', en: 'Interpolation Search' },
  summary: {
    zh: '插值搜索属于searching类别。',
    en: 'Interpolation Search is a searching algorithm.',
  },
  description: {
    zh: '插值搜索（Interpolation Search）属于searching类别的算法。',
    en: 'Interpolation Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log log n)', space: 'O(1)' },
};
