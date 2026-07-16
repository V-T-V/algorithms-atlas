import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-knapsack-mixed',
  categoryId: 'dp',
  title: { zh: '混合背包', en: 'Mixed Knapsack' },
  summary: {
    zh: '同时含 0/1、完全、多重三种物品的背包求最大价值。',
    en: 'Knapsack combining 0/1, unbounded, and bounded items to maximize value.',
  },
  description: {
    zh: '混合背包。物品分三类：0/1（每件只能取 1 次）、完全（无限件）、多重（最多 c[i] 件）。求容量 W 下最大价值。统一处理：对多重背包用二进制分组拆成若干 0/1 物品；完全背包内部按容量正序；0/1 背包按容量倒序。实现按物品类型分派转移方向。时间 O(N·W·log c)，空间 O(W)。',
    en: 'Mixed knapsack combining 0/1, unbounded, and bounded items. Bounded items split via binary grouping into 0/1 items. Dispatch transfer direction by item type. Time O(N·W·log c), space O(W).',
  },
  tags: ['dp', 'knapsack', 'mixed'],
  complexity: { time: 'O(N·W·log c)', space: 'O(W)' },
};
