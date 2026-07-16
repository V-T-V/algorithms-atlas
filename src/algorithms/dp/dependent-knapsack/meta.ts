// Dependent Knapsack · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dependent-knapsack',
  categoryId: 'dp',
  title: { zh: '依赖背包', en: 'Dependent Knapsack' },
  summary: {
    zh: '依赖背包属于dp类别。',
    en: 'Dependent Knapsack is a dp algorithm.',
  },
  description: {
    zh: '依赖背包（Dependent Knapsack）属于dp类别的算法。',
    en: 'Dependent Knapsack is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(n·W)', space: 'O(n·W)' },
};
