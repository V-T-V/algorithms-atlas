// 0/1 Knapsack · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'knapsack-01',
  categoryId: 'dp',
  title: { zh: '0/1 背包', en: '0/1 Knapsack' },
  summary: {
    zh: '0/1 背包属于dp类别。',
    en: '0/1 Knapsack is a dp algorithm.',
  },
  description: {
    zh: '0/1 背包（0/1 Knapsack）属于dp类别的算法。',
    en: '0/1 Knapsack is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(n·W)', space: 'O(n·W)' },
};
