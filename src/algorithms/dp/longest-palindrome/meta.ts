// Longest Palindromic Substring · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'longest-palindrome',
  categoryId: 'dp',
  title: { zh: '最长回文子串', en: 'Longest Palindromic Substring' },
  summary: {
    zh: '最长回文子串属于dp类别。',
    en: 'Longest Palindromic Substring is a dp algorithm.',
  },
  description: {
    zh: '最长回文子串（Longest Palindromic Substring）属于dp类别的算法。',
    en: 'Longest Palindromic Substring is an algorithm in the dp category.',
  },
  tags: ["dp","palindrome"],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
