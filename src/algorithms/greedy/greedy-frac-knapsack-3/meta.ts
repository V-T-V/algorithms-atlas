// 分数背包 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-frac-knapsack-3',
  categoryId: 'greedy',
  title: { zh: '分数背包', en: 'Fractional Knapsack' },
  summary: {
    zh: '物品可分割：按单位价值降序贪心装包直到容量满。',
    en: 'Items are divisible: pack by descending value-per-unit until capacity is exhausted.',
  },
  description: {
    zh: '分数背包问题：物品可任意分割。按价值/重量比降序，依次尽可能多地装入背包。',
    en: 'Fractional knapsack: items can be split. Sort by value/weight ratio descending and greedily fill the bag.',
  },
  tags: ['greedy', 'knapsack'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
