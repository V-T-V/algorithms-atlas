// 粒子群优化（Particle Swarm Optimization）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-particle-swarm-search',
  categoryId: 'ai-search',
  title: { zh: '粒子群优化', en: 'Particle Swarm Optimization' },
  summary: {
    zh: '粒子按个体最优与全局最优更新速度位置（Sphere 目标）。',
    en: 'Particles update velocity and position via personal and global bests (Sphere target).',
  },
  description: {
    zh: 'PSO（Kennedy & Eberhart 1995）：v = w·v + c1·r1·(pbest−x) + c2·r2·(gbest−x)，x += v。本实现最小化 Sphere（凸，最优点在原点）。',
    en: 'PSO (Kennedy & Eberhart 1995): v = w·v + c1·r1·(pbest−x) + c2·r2·(gbest−x); x += v. Minimizes the Sphere function (convex, optimum at origin).',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'pso'],
  complexity: { time: 'O(iter × p × d)', space: 'O(p × d)' },
};
