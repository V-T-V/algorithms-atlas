// Simulated Annealing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'simulated-annealing',
  categoryId: 'optimization',
  title: { zh: '模拟退火', en: 'Simulated Annealing' },
  summary: {
    zh: '模拟退火属于optimization类别。',
    en: 'Simulated Annealing is a optimization algorithm.',
  },
  description: {
    zh: '模拟退火（Simulated Annealing）属于optimization类别的算法。',
    en: 'Simulated Annealing is an algorithm in the optimization category.',
  },
  tags: ["optimization","metaheuristic"],
  complexity: { time: 'O(I)', space: 'O(1)' },
};
