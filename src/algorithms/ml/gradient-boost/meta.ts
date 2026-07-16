// Gradient Boosting · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gradient-boost',
  categoryId: 'ml',
  title: { zh: '梯度提升', en: 'Gradient Boosting' },
  summary: {
    zh: '梯度提升属于ml类别。',
    en: 'Gradient Boosting is a ml algorithm.',
  },
  description: {
    zh: '梯度提升（Gradient Boosting）属于ml类别的算法。',
    en: 'Gradient Boosting is an algorithm in the ml category.',
  },
  tags: ["ml","metaheuristic"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
