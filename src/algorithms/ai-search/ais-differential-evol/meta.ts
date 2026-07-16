// 差分进化（Differential Evolution）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-differential-evol',
  categoryId: 'ai-search',
  title: { zh: '差分进化', en: 'Differential Evolution' },
  summary: {
    zh: 'DE/rand/1/bin：差分变异 + 二项交叉 + 贪心选择。',
    en: 'DE/rand/1/bin: difference-vector mutation + binomial crossover + greedy selection.',
  },
  description: {
    zh: '差分进化（Storn & Price 1997）：变异 v = x_r1 + F·(x_r2 − x_r3)；与父代二项交叉 u；若 sphere(u) < sphere(x) 则替换。本实现最小化 Sphere。',
    en: 'DE (Storn & Price 1997): mutation v = x_r1 + F·(x_r2 − x_r3); binomial crossover with parent gives u; replace if sphere(u) < sphere(x). Minimizes Sphere.',
  },
  tags: ['ai-search', 'evolutionary', 'optimization', 'de'],
  complexity: { time: 'O(iter × pop × d)', space: 'O(pop × d)' },
};
