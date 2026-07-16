// 丑数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-ugly-2',
  categoryId: 'misc',
  title: { zh: '丑数', en: 'Ugly Number' },
  summary: {
    zh: '丑数是只含质因子 2、3、5 的正整数；判断 n 是否丑数。',
    en: 'An ugly number has only prime factors 2, 3, 5; check whether n is ugly.',
  },
  description: {
    zh: 'LeetCode 263 丑数：反复除尽 2、3、5，看最终是否为 1。',
    en: 'LeetCode 263 Ugly Number: divide out 2, 3, 5; check if the remainder is 1.',
  },
  tags: ['misc', 'math', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
