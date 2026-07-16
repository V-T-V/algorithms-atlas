// BFGS · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bfgs',
  categoryId: 'optimization',
  title: { zh: 'BFGS拟牛顿', en: 'BFGS' },
  summary: {
    zh: 'BFGS拟牛顿属于optimization类别。',
    en: 'BFGS is a optimization algorithm.',
  },
  description: {
    zh: 'BFGS拟牛顿（BFGS）属于optimization类别的算法。',
    en: 'BFGS is an algorithm in the optimization category.',
  },
  tags: ["optimization"],
  complexity: { time: 'O(k·n²)', space: 'O(n²)' },
};
