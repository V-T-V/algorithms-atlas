// Tabu Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tabu-search',
  categoryId: 'optimization',
  title: { zh: '禁忌搜索', en: 'Tabu Search' },
  summary: {
    zh: '禁忌搜索属于optimization类别。',
    en: 'Tabu Search is a optimization algorithm.',
  },
  description: {
    zh: '禁忌搜索（Tabu Search）属于optimization类别的算法。',
    en: 'Tabu Search is an algorithm in the optimization category.',
  },
  tags: ["optimization","searching"],
  complexity: { time: 'O(?)', space: 'O(?)' },
};
