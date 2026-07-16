// AdaBoost · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'adaboost',
  categoryId: 'ml',
  title: { zh: 'AdaBoost', en: 'AdaBoost' },
  summary: {
    zh: 'AdaBoost属于ml类别。',
    en: 'AdaBoost is a ml algorithm.',
  },
  description: {
    zh: 'AdaBoost（AdaBoost）属于ml类别的算法。',
    en: 'AdaBoost is an algorithm in the ml category.',
  },
  tags: ["ml"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
