// Blocking 2D · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'blocking',
  categoryId: 'ds',
  title: { zh: '二维分块', en: 'Blocking 2D' },
  summary: {
    zh: '二维分块属于ds类别。',
    en: 'Blocking 2D is a ds algorithm.',
  },
  description: {
    zh: '二维分块（Blocking 2D）属于ds类别的算法。',
    en: 'Blocking 2D is an algorithm in the ds category.',
  },
  tags: ["ds","range-query"],
  complexity: { time: 'O(√(RC))', space: 'O(RC)' },
};
