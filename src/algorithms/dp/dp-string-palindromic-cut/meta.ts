import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-string-palindromic-cut',
  categoryId: 'dp',
  title: { zh: '回文分割最少切割', en: 'Palindrome Partitioning II' },
  summary: {
    zh: '把字符串切成若干回文子串的最少切割次数。',
    en: 'Minimum cuts to partition a string into palindromic substrings.',
  },
  description: {
    zh: 'LeetCode 132。给定字符串 s，将其分割成若干子串使每个都是回文，求最少切割次数。先用区间 DP/中心扩展预处理 isPal[i][j] 表示 s[i..j] 是否回文；再 dp[i] = s[0..i] 的最少切割次数，dp[i]=min(dp[j-1]+1) 对所有满足 isPal[j][i] 的 j；若 s[0..i] 本身回文则 dp[i]=0。时间 O(n²)，空间 O(n²)。',
    en: 'LeetCode 132. Partition string s into palindromic substrings with minimum cuts. Precompute isPal[i][j]; dp[i]=min cuts for s[0..i]=min(dp[j-1]+1) over j where isPal[j][i]; 0 if s[0..i] is a palindrome. Time O(n²), space O(n²).',
  },
  tags: ['dp', 'palindrome', 'interval-dp', 'leetcode'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
