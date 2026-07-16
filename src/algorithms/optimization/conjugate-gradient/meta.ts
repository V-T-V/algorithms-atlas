// Conjugate Gradient · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conjugate-gradient',
  categoryId: 'optimization',
  title: { zh: '共轭梯度', en: 'Conjugate Gradient' },
  summary: {
    zh: '共轭梯度属于optimization类别。',
    en: 'Conjugate Gradient is a optimization algorithm.',
  },
  description: {
    zh: '共轭梯度（Conjugate Gradient）属于optimization类别的算法。',
    en: 'Conjugate Gradient is an algorithm in the optimization category.',
  },
  tags: ["optimization","metaheuristic"],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
