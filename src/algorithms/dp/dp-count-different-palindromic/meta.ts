// Count Different Palindromic · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-count-different-palindromic',
  categoryId: 'dp',
  title: { zh: '统计不同回文子序列', en: 'Count Different Palindromic Subsequences' },
  summary: {
    zh: '统计字符串中不同回文子序列的个数。',
    en: 'Count the number of distinct palindromic subsequences in a string.',
  },
  description: {
    zh: '给定字符串 s，求其不同（去重）回文子序列个数。区间 DP：dp[i][j] 表示 s[i..j] 中不同回文子序列数。若 s[i]==s[j]，需找到区间内最左/最右的同字符位置以避免重复计数（经典 LeetCode 730）。结果对 1e9+7 取模。时间 O(n²)。',
    en: 'Count distinct palindromic subsequences of s. Interval DP: dp[i][j] = number of distinct palindromic subsequences in s[i..j]. When s[i]==s[j], find the leftmost/rightmost same-char positions inside to avoid double counting (LeetCode 730). Result mod 1e9+7. Time O(n²).',
  },
  tags: ['dp', 'palindrome', 'subsequence', 'interval-dp', 'counting'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
