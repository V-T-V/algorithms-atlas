// Complete Knapsack · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'knapsack-complete',
  categoryId: 'dp',
  title: { zh: '完全背包', en: 'Complete Knapsack' },
  summary: {
    zh: '完全背包属于dp类别。',
    en: 'Complete Knapsack is a dp algorithm.',
  },
  description: {
    zh: '完全背包（Complete Knapsack）属于dp类别的算法。',
    en: 'Complete Knapsack is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(n·capacity)', space: 'O(n·capacity)' },
};
