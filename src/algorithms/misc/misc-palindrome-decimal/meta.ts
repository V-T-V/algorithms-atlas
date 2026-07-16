// 回文数构造（Palindromic Number Construction）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-palindrome-decimal',
  categoryId: 'misc',
  title: { zh: '回文数构造', en: 'Palindromic Number Construction' },
  summary: {
    zh: '把数字反转相加迭代，大多数数能产生回文（Lychrel 数例外）。',
    en: 'Reverse-and-add iteration yields palindromes for most numbers (Lychrel numbers excepted).',
  },
  description: {
    zh: '回文数构造：n = n + reverse(n)，重复直到回文。196 等是疑似 Lychrel 数（暂未得到回文）。',
    en: 'Palindrome construction: n = n + reverse(n), repeat until palindrome. 196 is a suspected Lychrel number.',
  },
  tags: ['misc', 'number-theory', 'palindrome'],
  complexity: { time: 'O(k·log n)', space: 'O(log n)' },
};
