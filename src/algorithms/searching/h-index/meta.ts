// H-Index · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'h-index',
  categoryId: 'searching',
  title: { zh: 'H 指数', en: 'H-Index' },
  summary: {
    zh: 'H 指数属于searching类别。',
    en: 'H-Index is a searching algorithm.',
  },
  description: {
    zh: 'H 指数（H-Index）属于searching类别的算法。',
    en: 'H-Index is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
