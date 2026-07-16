// Integer Square Root · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sqrt-int',
  categoryId: 'searching',
  title: { zh: '整数平方根', en: 'Integer Square Root' },
  summary: {
    zh: '整数平方根属于searching类别。',
    en: 'Integer Square Root is a searching algorithm.',
  },
  description: {
    zh: '整数平方根（Integer Square Root）属于searching类别的算法。',
    en: 'Integer Square Root is an algorithm in the searching category.',
  },
  tags: ["searching","range-query"],
  complexity: { time: 'O(log x)', space: 'O(1)' },
};
