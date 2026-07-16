// 递减字符串拆分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-split-2',
  categoryId: 'greedy',
  title: { zh: '递减字符串拆分', en: 'Split a String in Descending Order' },
  summary: {
    zh: '把字符串拆成最多段，每段数值严格递减。',
    en: 'Split the string into the maximum number of pieces with strictly decreasing values.',
  },
  description: {
    zh: 'LeetCode 1849 将字符串拆分为递减的连续值：从左端开始贪心取尽量短的前缀作为第一段，再递归判断后续。',
    en: 'LeetCode 1849 Split a String Into the Max Number of Unique Substrings with descending values: greedily take short prefixes then recurse.',
  },
  tags: ['greedy', 'backtracking', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
