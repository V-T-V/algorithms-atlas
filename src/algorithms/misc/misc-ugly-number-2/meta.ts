// 丑数判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-ugly-number-2',
  categoryId: 'misc',
  title: { zh: '丑数判定', en: 'Ugly Number Check' },
  summary: {
    zh: '判定正整数是否只含因子 2/3/5（LeetCode 263）。',
    en: 'Check whether a positive integer has only factors 2, 3, 5 (LeetCode 263).',
  },
  description: {
    zh: 'LeetCode 263 丑数判定：\n\n- 丑数 = 只含质因子 2、3、5 的正整数（1 是丑数）。\n- 方法：对 2、3、5 反复整除，最后若剩下 1 则是丑数。\n- 非正整数（<=0）不是丑数。',
    en: 'LeetCode 263 Ugly Number:\n\n- An ugly number is a positive integer whose only prime factors are 2, 3, 5 (1 is ugly).\n- Method: repeatedly divide by 2, 3, 5; if the remainder is 1, it is ugly.\n- Non-positive numbers are not ugly.',
  },
  tags: ['misc', 'math', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
