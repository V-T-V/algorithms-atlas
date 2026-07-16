// 萤火虫算法（Firefly Algorithm）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-firefly',
  categoryId: 'ai-search',
  title: { zh: '萤火虫算法', en: 'Firefly Algorithm' },
  summary: {
    zh: '亮度低者被亮度高者吸引，吸引力随距离指数衰减。',
    en: 'Less bright fireflies are attracted to brighter ones; attractiveness decays with distance.',
  },
  description: {
    zh: '萤火虫算法（Yang 2008）：亮度 I = 1/(1+f)；吸引力 β = β0·exp(−γr²)；位置更新 x_i = x_i + β·(x_j − x_i) + α·(rand−0.5)。本实现最小化 Sphere。',
    en: 'Firefly algorithm (Yang 2008): brightness I = 1/(1+f); attractiveness β = β0·exp(−γr²); position update x_i = x_i + β·(x_j − x_i) + α·(rand−0.5). Minimizes Sphere.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'firefly'],
  complexity: { time: 'O(iter × n² × d)', space: 'O(n × d)' },
};
