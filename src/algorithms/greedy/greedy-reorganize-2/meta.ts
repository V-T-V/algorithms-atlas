// 重构字符串 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-reorganize-2',
  categoryId: 'greedy',
  title: { zh: '重构字符串', en: 'Reorganize String' },
  summary: {
    zh: '重排使相邻字符不同；按频率贪心填偶数位再奇数位。',
    en: 'Rearrange so no two neighbors match; greedily fill even then odd slots by frequency.',
  },
  description: {
    zh: 'LeetCode 767 重构字符串：检查能否重排 s 使相邻字符不同。按频率从高到低填入偶数下标，再填奇数下标。',
    en: 'LeetCode 767 Reorganize String: can s be rearranged so neighbors differ? Fill even indices then odd indices in descending frequency order.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
