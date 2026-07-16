// Fractional Knapsack · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fractional-knapsack',
  categoryId: 'greedy',
  title: { zh: '分数背包', en: 'Fractional Knapsack' },
  summary: {
    zh: '分数背包属于greedy类别。',
    en: 'Fractional Knapsack is a greedy algorithm.',
  },
  description: {
    zh: '分数背包（Fractional Knapsack）属于greedy类别的算法。',
    en: 'Fractional Knapsack is an algorithm in the greedy category.',
  },
  tags: ["greedy","dynamic-programming"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
