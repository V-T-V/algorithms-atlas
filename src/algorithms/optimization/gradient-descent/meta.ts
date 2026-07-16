// Gradient Descent · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gradient-descent',
  categoryId: 'optimization',
  title: { zh: '梯度下降', en: 'Gradient Descent' },
  summary: {
    zh: '梯度下降属于optimization类别。',
    en: 'Gradient Descent is a optimization algorithm.',
  },
  description: {
    zh: '梯度下降（Gradient Descent）属于optimization类别的算法。',
    en: 'Gradient Descent is an algorithm in the optimization category.',
  },
  tags: ["optimization","metaheuristic","parsing"],
  complexity: { time: 'O(n · iter)', space: 'O(n)' },
};
