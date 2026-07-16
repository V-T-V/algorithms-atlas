// 分发糖果 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-candy-2',
  categoryId: 'greedy',
  title: { zh: '分发糖果', en: 'Candy' },
  summary: {
    zh: '每个孩子至少 1 颗糖，相邻评分高的得更多；两遍扫描求最少糖。',
    en: 'Each child gets ≥1 candy, more than neighbors with lower ratings; two sweeps find the minimum.',
  },
  description: {
    zh: 'LeetCode 135 分发糖果：n 个孩子按评分 ratings 排队，相邻孩子评分高的必须拿到更多糖。两遍贪心扫描求最少总糖果。',
    en: 'LeetCode 135 Candy: n children with ratings; higher-rated neighbor must get more candy. Two-sweep greedy for the minimum total.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
