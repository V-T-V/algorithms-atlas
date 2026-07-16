// Fibonacci Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fibonacci-search',
  categoryId: 'searching',
  title: { zh: '斐波那契搜索', en: 'Fibonacci Search' },
  summary: {
    zh: '斐波那契搜索属于searching类别。',
    en: 'Fibonacci Search is a searching algorithm.',
  },
  description: {
    zh: '斐波那契搜索（Fibonacci Search）属于searching类别的算法。',
    en: 'Fibonacci Search is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
