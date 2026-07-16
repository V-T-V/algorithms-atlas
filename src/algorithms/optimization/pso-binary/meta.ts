// Binary PSO · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pso-binary',
  categoryId: 'optimization',
  title: { zh: '二进制粒子群', en: 'Binary PSO' },
  summary: {
    zh: '二进制粒子群属于optimization类别。',
    en: 'Binary PSO is a optimization algorithm.',
  },
  description: {
    zh: '二进制粒子群（Binary PSO）属于optimization类别的算法。',
    en: 'Binary PSO is an algorithm in the optimization category.',
  },
  tags: ["optimization","metaheuristic"],
  complexity: { time: 'O(particles · bits · iter)', space: 'O(particles · bits)' },
};
