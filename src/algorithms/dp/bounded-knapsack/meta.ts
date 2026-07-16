// Bounded Knapsack · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bounded-knapsack',
  categoryId: 'dp',
  title: { zh: '有界背包', en: 'Bounded Knapsack' },
  summary: {
    zh: '有界背包属于dp类别。',
    en: 'Bounded Knapsack is a dp algorithm.',
  },
  description: {
    zh: '有界背包（Bounded Knapsack）属于dp类别的算法。',
    en: 'Bounded Knapsack is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(W·Σlog count)', space: 'O(W)' },
};
