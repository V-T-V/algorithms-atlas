// Harmony Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'harmony-search',
  categoryId: 'optimization',
  title: { zh: '和声搜索', en: 'Harmony Search' },
  summary: {
    zh: '和声搜索属于optimization类别。',
    en: 'Harmony Search is a optimization algorithm.',
  },
  description: {
    zh: '和声搜索（Harmony Search）属于optimization类别的算法。',
    en: 'Harmony Search is an algorithm in the optimization category.',
  },
  tags: ["optimization","searching"],
  complexity: { time: 'O(k·n)', space: 'O(HMS·n)' },
};
