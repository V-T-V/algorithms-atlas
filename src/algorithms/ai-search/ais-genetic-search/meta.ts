// 遗传算法搜索（Genetic Algorithm Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-genetic-search',
  categoryId: 'ai-search',
  title: { zh: '遗传算法搜索', en: 'Genetic Algorithm Search' },
  summary: {
    zh: '选择+交叉+变异，逐代演化近似最优解（OneMax 目标）。',
    en: 'Selection + crossover + mutation evolving near-optimal solutions (OneMax target).',
  },
  description: {
    zh: '遗传算法（Holland 1975）维护二进制种群，按适应度（OneMax：1 越多越好）选择父代，单点交叉产生后代，按概率 pm 翻转变异。逐代逼近全 1 串。',
    en: 'The genetic algorithm (Holland 1975) maintains a binary population; parents are chosen by fitness (OneMax: more 1s is better); single-point crossover produces offspring; bits flip with probability pm. Approaches the all-ones string.',
  },
  tags: ['ai-search', 'evolutionary', 'optimization', 'genetic'],
  complexity: { time: 'O(g × p × n)', space: 'O(p × n)' },
};
