// Ant Colony Optimization · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ant-colony',
  categoryId: 'optimization',
  title: { zh: '蚁群算法', en: 'Ant Colony Optimization' },
  summary: {
    zh: '蚁群算法属于optimization类别。',
    en: 'Ant Colony Optimization is a optimization algorithm.',
  },
  description: {
    zh: '蚁群算法（Ant Colony Optimization）属于optimization类别的算法。',
    en: 'Ant Colony Optimization is an algorithm in the optimization category.',
  },
  tags: ["optimization","metaheuristic"],
  complexity: { time: 'O(I · m · n²)', space: 'O(n²)' },
};
