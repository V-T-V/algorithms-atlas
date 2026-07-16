// Newton Optimization · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'newton-opt',
  categoryId: 'optimization',
  title: { zh: '牛顿法优化', en: 'Newton Optimization' },
  summary: {
    zh: '牛顿法优化属于optimization类别。',
    en: 'Newton Optimization is a optimization algorithm.',
  },
  description: {
    zh: '牛顿法优化（Newton Optimization）属于optimization类别的算法。',
    en: 'Newton Optimization is an algorithm in the optimization category.',
  },
  tags: ["optimization","numerical-method"],
  complexity: { time: 'O(k·n³)', space: 'O(n²)' },
};
