// 锦标赛选择 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-tournament',
  categoryId: 'selection',
  title: { zh: '锦标赛选择（遗传算法）', en: 'Tournament Selection (GA)' },
  summary: {
    zh: '随机抽 k 个个体，选适应度最高者作为父代，常用于遗传算法。',
    en: 'Randomly draw k individuals and pick the fittest as a parent; common in genetic algorithms.',
  },
  description: {
    zh: '锦标赛选择：从种群中无放回（或有放回）随机抽 k 个，返回适应度最优者。k 越大选择压力越大。简单、无需排序、易并行。',
    en: 'Tournament selection: draw k individuals (with or without replacement) and return the fittest. Larger k means stronger selection pressure. Simple, no sorting needed, parallelizable.',
  },
  tags: ['selection', 'genetic-algorithm', 'tournament'],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
