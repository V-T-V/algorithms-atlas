// Multiple Knapsack · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'knapsack-multiple',
  categoryId: 'dp',
  title: { zh: '多重背包', en: 'Multiple Knapsack' },
  summary: {
    zh: '多重背包属于dp类别。',
    en: 'Multiple Knapsack is a dp algorithm.',
  },
  description: {
    zh: '多重背包（Multiple Knapsack）属于dp类别的算法。',
    en: 'Multiple Knapsack is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(capacity · Σ log count)', space: 'O(capacity)' },
};
