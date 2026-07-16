// Logistic Regression · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'logistic-regression',
  categoryId: 'ml',
  title: { zh: '逻辑回归', en: 'Logistic Regression' },
  summary: {
    zh: '逻辑回归属于ml类别。',
    en: 'Logistic Regression is a ml algorithm.',
  },
  description: {
    zh: '逻辑回归（Logistic Regression）属于ml类别的算法。',
    en: 'Logistic Regression is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n·d·T)', space: 'O(d)' },
};
