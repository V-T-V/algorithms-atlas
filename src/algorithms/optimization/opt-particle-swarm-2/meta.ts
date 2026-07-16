// 粒子群优化（Particle Swarm Optimization）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-particle-swarm-2',
  categoryId: 'optimization',
  title: { zh: '粒子群优化', en: 'Particle Swarm Optimization' },
  summary: {
    zh: '群体智能：每个粒子受自身最优与全局最优吸引，迭代搜索。',
    en: 'Swarm intelligence: each particle pulled by its own and the global best; iterative search.',
  },
  description: {
    zh: 'PSO：v←ωv+c1r1(pBest-x)+c2r2(gBest-x)；x←x+v。群体涌现全局搜索能力。',
    en: 'PSO: v<-ωv+c1r1(pBest-x)+c2r2(gBest-x); x<-x+v. Emergent global search.',
  },
  tags: ['optimization', 'metaheuristic', 'swarm'],
  complexity: { time: 'O(k·n·d)', space: 'O(n·d)' },
};
