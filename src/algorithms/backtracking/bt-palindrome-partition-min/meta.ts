// 最少回文分割 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-palindrome-partition-min',
  categoryId: 'backtracking',
  title: { zh: '最少回文分割', en: 'Palindrome Partitioning (Min Cuts)' },
  summary: {
    zh: '回溯 + 记忆化求把字符串分成回文子串的最少切割次数。',
    en: 'Backtracking with memoization to find the minimum cuts partitioning a string into palindromes.',
  },
  description: {
    zh: '枚举每个回文前缀，递归处理剩余后缀，用记忆化剪枝记录每个起点的最少切割数。',
    en: 'Enumerate each palindromic prefix, recurse on the suffix, and memoize the minimum cuts starting at each position.',
  },
  tags: ['backtracking', 'palindrome', 'memoization'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
