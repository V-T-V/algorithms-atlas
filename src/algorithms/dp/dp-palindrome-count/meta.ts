import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-palindrome-count',
  categoryId: 'dp',
  title: { zh: '回文子串计数', en: 'Palindromic Substrings' },
  summary: {
    zh: '区间 DP 统计字符串中所有回文子串个数。',
    en: 'Interval DP counting all palindromic substrings.',
  },
  description: {
    zh: '给定字符串 s，统计其中回文子串的数目（不同位置即视为不同子串）。用区间 DP：isPal[i][j] 表示 s[i..j] 是否回文，按长度递增计算。长度为 1 恒真；长度为 2 当 s[i]==s[j]；长度≥3 当 s[i]==s[j] 且 isPal[i+1][j-1]。累计所有 true 的数目。时间 O(n²)。',
    en: 'Count palindromic substrings of a string (different positions count separately). Interval DP: isPal[i][j] indicates whether s[i..j] is a palindrome, computed by increasing length. Length 1 always true; length 2 iff s[i]==s[j]; length >=3 iff s[i]==s[j] and isPal[i+1][j-1]. Sum the true entries. Time O(n²).',
  },
  tags: ['dp', 'interval', 'palindrome', 'string'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
