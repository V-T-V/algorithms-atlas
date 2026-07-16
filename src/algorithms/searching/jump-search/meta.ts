// Jump Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jump-search',
  categoryId: 'searching',
  title: { zh: '跳跃搜索', en: 'Jump Search' },
  summary: {
    zh: '跳跃搜索属于searching类别。',
    en: 'Jump Search is a searching algorithm.',
  },
  description: {
    zh: '跳跃搜索（Jump Search）属于searching类别的算法。',
    en: 'Jump Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
