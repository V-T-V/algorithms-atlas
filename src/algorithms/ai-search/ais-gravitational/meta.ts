// 引力搜索（Gravitational Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-gravitational',
  categoryId: 'ai-search',
  title: { zh: '引力搜索', en: 'Gravitational Search' },
  summary: {
    zh: '粒子按质量与距离互相吸引（万有引力模型）。',
    en: 'Particles attract by mass and distance (gravity model).',
  },
  description: {
    zh: '引力搜索算法（Rashedi 2009）：质量正比于适应度；粒子按 F = G·m1·m2/r² 互相吸引；加速度 a = F/m 更新速度与位置。本实现最小化 Sphere。',
    en: 'GSA (Rashedi 2009): mass proportional to fitness; particles attract via F = G·m1·m2/r²; acceleration a = F/m updates velocity and position. Minimizes Sphere.',
  },
  tags: ['ai-search', 'physics', 'optimization', 'gsa'],
  complexity: { time: 'O(iter × n² × d)', space: 'O(n × d)' },
};
