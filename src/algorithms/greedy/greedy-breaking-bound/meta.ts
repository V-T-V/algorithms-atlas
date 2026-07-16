// 破界贪心（LP 松弛上界）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-breaking-bound',
  categoryId: 'greedy',
  title: { zh: '破界贪心（0-1 背包 LP 上界）', en: 'LP-Relaxation Bound (0-1 Knapsack)' },
  summary: {
    zh: '用线性松弛贪心求 0-1 背包的上界，供分支限界剪枝使用。',
    en: 'Use linear-relaxation greedy to bound the 0-1 knapsack optimum, for branch-and-bound pruning.',
  },
  description: {
    zh: '按价值密度降序取整件，剩余容量按分数取最后一件，得到整数解的上界。',
    en: 'Take items by value-density until full; take a fraction of the next item; this gives an upper bound on the integer optimum.',
  },
  tags: ['greedy', 'branch-and-bound', 'knapsack'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
