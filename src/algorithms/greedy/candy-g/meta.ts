// 分糖果（Candy, 贪心版, LeetCode 135）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'candy-g',
  categoryId: 'greedy',
  title: { zh: '分糖果（贪心）', en: 'Candy (Greedy)' },
  summary: {
    zh: '相邻孩子得分高者糖果更多，求最少糖果总数（左右两遍扫描）。',
    en: 'Higher-scoring neighbors get more candies; minimize total (two-pass scan).',
  },
  description: {
    zh: 'N 个孩子排成一排，每个孩子有一个评分 ratings[i]。你要给他们分发糖果，满足：\n1) 每个孩子至少 1 颗糖果；\n2) 相邻孩子中评分更高的那个必须拿到更多糖果。\n求最少需要多少颗糖果。\n\n贪心两遍扫描：先从左到右，若 ratings[i] > ratings[i-1] 则 candies[i] = candies[i-1]+1，否则 1；再从右到左，若 ratings[i] > ratings[i+1] 则 candies[i] = max(candies[i], candies[i+1]+1)。最终求和。O(n)。',
    en: 'N children in a row, each with a rating ratings[i]. Distribute candies so that: 1) every child gets at least one candy; 2) among neighbors, the higher-rated one gets strictly more. Minimize the total candies.\n\nGreedy two-pass: first left to right, if ratings[i] > ratings[i-1] then candies[i] = candies[i-1]+1, else 1; then right to left, if ratings[i] > ratings[i+1] then candies[i] = max(candies[i], candies[i+1]+1). Sum the result. O(n).',
  },
  tags: ['greedy', 'array'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  references: [{ label: 'LeetCode 135', url: 'https://leetcode.com/problems/candy/' }],
  defaultInput: [1, 0, 2],
};
