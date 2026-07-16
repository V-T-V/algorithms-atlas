// 0/1 背包密度贪心（0/1 Knapsack Density Greedy）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-knapsack-density',
  categoryId: 'greedy',
  title: { zh: '0/1 背包密度贪心', en: '0/1 Knapsack Density Greedy' },
  summary: {
    zh: '0/1 背包按价值密度贪心取整，作为 DP 最优解的上界与近似。',
    en: '0/1 knapsack greedy by value density serves as upper bound and approximation to DP optimum.',
  },
  description: {
    zh: '0/1 背包（不可分割）：按价值/重量降序贪心取，遇装不下跳过。结果 ≤ OPT，比值 ≤ 2（与最优单物品比）。',
    en: '0/1 knapsack (indivisible): greedy by density descending, skip if it doesnt fit. Result <= OPT, ratio <= 2.',
  },
  tags: ['greedy', 'knapsack', 'approximation'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
