import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-lcs-2',
  categoryId: 'dp',
  title: { zh: '最短公共超序列', en: 'Shortest Common Supersequence' },
  summary: {
    zh: '求同时包含两字符串为子序列的最短字符串长度。',
    en: 'Find the length of the shortest string containing both strings as subsequences.',
  },
  description: {
    zh: '最短公共超序列（SCS）。给定字符串 s1、s2，求最短字符串 S 使 s1、s2 均为 S 的子序列。SCS 长度 = n + m - LCS(s1,s2)。DP：dp[i][j] 为 s1[0..i) 与 s2[0..j) 的 SCS 长度。转移：字符相等则 dp[i][j]=dp[i-1][j-1]+1；否则 dp[i][j]=min(dp[i-1][j],dp[i][j-1])+1。时间 O(nm)，空间 O(nm)。',
    en: 'Shortest Common Supersequence (SCS). SCS length = n + m - LCS. DP dp[i][j]=SCS of s1[0..i),s2[0..j). Match: +1 from diagonal; mismatch: 1+min(left/up). Time O(nm), space O(nm).',
  },
  tags: ['dp', 'lcs', 'string', 'sequence'],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
};
