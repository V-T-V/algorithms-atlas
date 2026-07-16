// Particle Swarm Optimization · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pso',
  categoryId: 'optimization',
  title: { zh: '粒子群优化', en: 'Particle Swarm Optimization' },
  summary: {
    zh: '粒子群优化属于optimization类别。',
    en: 'Particle Swarm Optimization is a optimization algorithm.',
  },
  description: {
    zh: '粒子群优化（Particle Swarm Optimization）属于optimization类别的算法。',
    en: 'Particle Swarm Optimization is an algorithm in the optimization category.',
  },
  tags: ["optimization","metaheuristic"],
  complexity: { time: 'O(I·S·D)', space: 'O(S·D)' },
};
