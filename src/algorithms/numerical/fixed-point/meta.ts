// Fixed Point Iteration · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fixed-point',
  categoryId: 'numerical',
  title: { zh: '不动点迭代', en: 'Fixed Point Iteration' },
  summary: {
    zh: '不动点迭代属于numerical类别。',
    en: 'Fixed Point Iteration is a numerical algorithm.',
  },
  description: {
    zh: '不动点迭代（Fixed Point Iteration）属于numerical类别的算法。',
    en: 'Fixed Point Iteration is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
