// Find Peak Element · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'find-peak',
  categoryId: 'searching',
  title: { zh: '寻找峰值', en: 'Find Peak Element' },
  summary: {
    zh: '寻找峰值属于searching类别。',
    en: 'Find Peak Element is a searching algorithm.',
  },
  description: {
    zh: '寻找峰值（Find Peak Element）属于searching类别的算法。',
    en: 'Find Peak Element is an algorithm in the searching category.',
  },
  tags: ["searching","union-find"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
