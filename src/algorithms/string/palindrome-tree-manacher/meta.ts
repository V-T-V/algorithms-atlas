// Manacher 回文半径（最长回文子串）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'palindrome-tree-manacher',
  categoryId: 'string',
  title: {
    zh: 'Manacher 回文半径（最长回文子串）',
    en: 'Manacher Palindrome Radii (Longest Palindrome)',
  },
  summary: {
    zh: 'Manacher 算法 O(n) 求每个中心的回文半径，得最长回文子串。',
    en: 'Manacher algorithm computes each center palindrome radius in O(n) to get the longest palindromic substring.',
  },
  description: {
    zh: 'Manacher 算法用「插分隔符」技巧把奇偶长度统一为奇数中心，再用已知的回文半径与对称性 O(n) 求出每个中心的最长回文半径数组 p[]。由 p 可立即得到最长回文子串及其位置，也可计数所有回文子串。区别于已有的 palindrome-tree（Eertree，存储本质不同回文），本算法聚焦回文半径与最长回文子串，时间 O(n)。',
    en: 'Manacher algorithm inserts separators to unify odd/even lengths into odd centers, then uses known radii and symmetry to compute each center longest palindrome radius array p[] in O(n). From p one immediately gets the longest palindromic substring and its position, and can count all palindromic substrings. Distinct from the existing palindrome-tree (Eertree, storing distinct palindromes), this focuses on radii and the longest palindrome in O(n).',
  },
  tags: ['string', 'palindrome', 'manacher', 'longest-palindrome'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
