// Group Knapsack · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'group-knapsack',
  categoryId: 'dp',
  title: { zh: '分组背包', en: 'Group Knapsack' },
  summary: {
    zh: '分组背包属于dp类别。',
    en: 'Group Knapsack is a dp algorithm.',
  },
  description: {
    zh: '分组背包（Group Knapsack）属于dp类别的算法。',
    en: 'Group Knapsack is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(?)', space: 'O(?)' },
};
