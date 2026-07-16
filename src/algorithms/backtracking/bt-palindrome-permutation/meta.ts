// 回文排列判定 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-palindrome-permutation',
  categoryId: 'backtracking',
  title: { zh: '回文排列判定', en: 'Palindrome Permutation' },
  summary: {
    zh: '判断字符串能否重排成回文（至多一个字母出现奇数次）。',
    en: 'Check whether a string can be rearranged into a palindrome (at most one odd-count letter).',
  },
  description: {
    zh: '回文要求成对字母对称，因此至多一个字母出现奇数次。统计字符频数即可判定。',
    en: 'A palindrome pairs letters symmetrically, so at most one letter may have an odd count. Count frequencies to decide.',
  },
  tags: ['backtracking', 'palindrome', 'hashing'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
