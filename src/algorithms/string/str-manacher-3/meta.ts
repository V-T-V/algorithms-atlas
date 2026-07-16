import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-manacher-3',
  categoryId: 'string',
  title: { zh: 'Manacher（最长回文子串）', en: 'Manacher (Longest Palindromic Substring)' },
  summary: {
    zh: 'O(n) 计算以每个位置为中心的最长回文半径。',
    en: 'O(n) computes the longest palindromic radius centered at each position.',
  },
  description: {
    zh: '在字符间插入分隔符统一处理奇偶回文，利用最右回文框加速。',
    en: 'Insert separators between characters to unify odd/even cases; uses the rightmost palindrome box to accelerate.',
  },
  tags: ['string', 'manacher', 'palindrome'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
