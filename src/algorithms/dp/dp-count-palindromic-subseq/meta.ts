import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-count-palindromic-subseq',
  categoryId: 'dp',
  title: { zh: '回文子序列计数', en: 'Count Palindromic Subsequences' },
  summary: {
    zh: '统计字符串中所有回文子序列的个数。',
    en: 'Count the total number of palindromic subsequences of a string.',
  },
  description: {
    zh: 'LeetCode 730 的简化计数版。给定字符串 s，统计不同的回文子序列个数（含单字符）。DP：dp[i][j]=s[i..j] 中不同回文子序列个数。转移：若 s[i]==s[j]，设内部 s[i+1..j-1] 中与 s[i] 同字符的位置，则新增一批以 s[i] 为两端的回文；若 s[i]!=s[j]，则 dp[i][j]=dp[i+1][j]+dp[i][j-1]-dp[i+1][j-1]（容斥）。本实现给出「所有（可重复）回文子序列」计数：若 s[i]==s[j] 则 dp[i][j]=2*dp[i+1][j-1]+（内部是否已有端点字符的加减），否则容斥相加。时间 O(n²)，空间 O(n²)。',
    en: 'Count palindromic subsequences of s. DP dp[i][j]=count for s[i..j]. If s[i]==s[j]: dp=2*dp[i+1][j-1] adjusted for inner same-char; else inclusion-exclusion. Time O(n²), space O(n²).',
  },
  tags: ['dp', 'palindrome', 'string', 'counting'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
