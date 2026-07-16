// CMA-ES · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cma-es',
  categoryId: 'optimization',
  title: { zh: 'CMA-ES', en: 'CMA-ES' },
  summary: {
    zh: 'CMA-ES属于optimization类别。',
    en: 'CMA-ES is a optimization algorithm.',
  },
  description: {
    zh: 'CMA-ES（CMA-ES）属于optimization类别的算法。',
    en: 'CMA-ES is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(g·λ·n)', space: 'O(λ·n)' },
};
