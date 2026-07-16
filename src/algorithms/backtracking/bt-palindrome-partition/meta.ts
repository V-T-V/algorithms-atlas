// 分割回文串 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-palindrome-partition',
  categoryId: 'backtracking',
  title: { zh: '分割回文串', en: 'Palindrome Partitioning' },
  summary: {
    zh: '把字符串分割成若干回文子串的所有方案。',
    en: 'All ways to partition a string into palindromic substrings.',
  },
  description: {
    zh: '回溯：对每个切点尝试切回文。',
    en: 'Backtrack, cut palindrome prefixes. O(n*2^n).',
  },
  tags: ['backtracking', 'palindrome'],
  complexity: { time: 'O(n*2^n)', space: 'O(n)' },
};
