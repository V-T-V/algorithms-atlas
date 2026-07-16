// Perceptron · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'perceptron',
  categoryId: 'ml',
  title: { zh: '感知器', en: 'Perceptron' },
  summary: {
    zh: '感知器属于ml类别。',
    en: 'Perceptron is a ml algorithm.',
  },
  description: {
    zh: '感知器（Perceptron）属于ml类别的算法。',
    en: 'Perceptron is an algorithm in the ml category.',
  },
  tags: ["ml"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
