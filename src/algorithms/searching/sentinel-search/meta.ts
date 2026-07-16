// Sentinel Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sentinel-search',
  categoryId: 'searching',
  title: { zh: '哨兵查找', en: 'Sentinel Search' },
  summary: {
    zh: '哨兵查找属于searching类别。',
    en: 'Sentinel Search is a searching algorithm.',
  },
  description: {
    zh: '哨兵查找（Sentinel Search）属于searching类别的算法。',
    en: 'Sentinel Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
