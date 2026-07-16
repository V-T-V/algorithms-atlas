// Chebyshev Root · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'chebyshev',
  categoryId: 'numerical',
  title: { zh: '切比雪夫求根', en: 'Chebyshev Root' },
  summary: {
    zh: '切比雪夫求根属于numerical类别。',
    en: 'Chebyshev Root is a numerical algorithm.',
  },
  description: {
    zh: '切比雪夫求根（Chebyshev Root）属于numerical类别的算法。',
    en: 'Chebyshev Root is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
