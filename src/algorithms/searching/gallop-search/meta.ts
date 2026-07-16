// Gallop / Exponential Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gallop-search',
  categoryId: 'searching',
  title: { zh: '跳跃查找', en: 'Gallop / Exponential Search' },
  summary: {
    zh: '跳跃查找属于searching类别。',
    en: 'Gallop / Exponential Search is a searching algorithm.',
  },
  description: {
    zh: '跳跃查找（Gallop / Exponential Search）属于searching类别的算法。',
    en: 'Gallop / Exponential Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
