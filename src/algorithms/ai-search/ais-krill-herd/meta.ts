// 磷虾群算法（Krill Herd Algorithm）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-krill-herd',
  categoryId: 'ai-search',
  title: { zh: '磷虾群算法', en: 'Krill Herd Algorithm' },
  summary: {
    zh: '磷虾群：诱导、觅食、扩散三种运动协同搜索。',
    en: 'Krill herd: induction, foraging, and diffusion motions cooperate.',
  },
  description: {
    zh: '磷虾群算法（Gandomi & Alavi 2012）：每个磷虾位置由三部分运动更新：邻居诱导 N、觅食运动 F、物理扩散 D。dx/dt = N + F + D。本实现最小化 Sphere。',
    en: 'KHA (Gandomi & Alavi 2012): each krill position is updated by three motion components: neighbor-induced N, foraging F, physical diffusion D; dx/dt = N + F + D. Minimizes Sphere.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'krill'],
  complexity: { time: 'O(iter × n × d)', space: 'O(n × d)' },
};
