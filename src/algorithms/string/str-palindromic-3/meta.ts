import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-palindromic-3',
  categoryId: 'string',
  title: { zh: '回文子串计数（DP）', en: 'Palindromic Substring Count (DP)' },
  summary: {
    zh: 'O(n^2) DP 统计所有回文子串数量。',
    en: 'O(n^2) DP counting all palindromic substrings.',
  },
  description: {
    zh: 'isPal[i][j] = (s[i]==s[j]) && isPal[i+1][j-1]；按长度递推。',
    en: 'isPal[i][j] = (s[i]==s[j]) && isPal[i+1][j-1]; iterate by length.',
  },
  tags: ['string', 'palindrome', 'dp'],
  complexity: { time: 'O(n^2)', space: 'O(n^2)' },
};
