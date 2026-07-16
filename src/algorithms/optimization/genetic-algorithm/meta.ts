// Genetic Algorithm · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'genetic-algorithm',
  categoryId: 'optimization',
  title: { zh: '遗传算法', en: 'Genetic Algorithm' },
  summary: {
    zh: '遗传算法属于optimization类别。',
    en: 'Genetic Algorithm is a optimization algorithm.',
  },
  description: {
    zh: '遗传算法（Genetic Algorithm）属于optimization类别的算法。',
    en: 'Genetic Algorithm is an algorithm in the optimization category.',
  },
  tags: ["optimization","metaheuristic"],
  complexity: { time: 'O(G·N·L)', space: 'O(N·L)' },
};
