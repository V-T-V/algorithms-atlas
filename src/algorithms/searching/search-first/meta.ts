// Find First Occurrence · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-first',
  categoryId: 'searching',
  title: { zh: '查找第一个等于', en: 'Find First Occurrence' },
  summary: {
    zh: '查找第一个等于属于searching类别。',
    en: 'Find First Occurrence is a searching algorithm.',
  },
  description: {
    zh: '查找第一个等于（Find First Occurrence）属于searching类别的算法。',
    en: 'Find First Occurrence is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
