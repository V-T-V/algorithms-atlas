// 灰狼优化（Grey Wolf Optimizer）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-grey-wolf',
  categoryId: 'ai-search',
  title: { zh: '灰狼优化', en: 'Grey Wolf Optimizer' },
  summary: {
    zh: 'α、β、δ 三阶首领引导狼群包围猎物（Sphere 目标）。',
    en: 'α, β, δ leaders guide wolves to encircle prey (Sphere target).',
  },
  description: {
    zh: '灰狼优化（Mirjalili 2014）：α、β、δ 是当前最优三个解；其余 ω 狼按三者平均位置更新。系数 A、C 随机以平衡探索与开发。本实现最小化 Sphere。',
    en: 'GWO (Mirjalili 2014): α, β, δ are the three best solutions; remaining ω wolves update using their average position. Random A, C balance exploration/exploitation. Minimizes Sphere.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'gwo'],
  complexity: { time: 'O(iter × wolves × d)', space: 'O(wolves × d)' },
};
