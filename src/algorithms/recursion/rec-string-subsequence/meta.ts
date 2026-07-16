// 字符串子序列 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rec-string-subsequence',
  categoryId: 'recursion',
  title: { zh: '不同子序列计数', en: 'Distinct Subsequences Count' },
  summary: {
    zh: '递归+记忆化统计字符串的不同非空子序列个数，对大数取模。',
    en: 'Count distinct non-empty subsequences of a string via recursion with memoization, modulo a large prime.',
  },
  description: {
    zh: '给定字符串 s，求其不同子序列的个数。朴素递归：以位置 i 结尾的子序列数 = Σ（前面各位置贡献）。更高效的做法是动态规划：dp[i] 表示前 i 个字符构成的不同子序列数，dp[i] = 2·dp[i-1] - dp[last[s[i]]-1]（减去重复）。本实现提供递归+记忆化版本，对 10^9+7 取模。',
    en: 'Given a string s, count its distinct subsequences. Naive recursion counts subsequences ending at each position. A more efficient DP: dp[i] = number of distinct subsequences of the first i chars, dp[i] = 2·dp[i-1] - dp[last[s[i]]-1] (subtracting duplicates). This implementation provides a recursive memoized version, modulo 10^9+7.',
  },
  tags: ['recursion', 'subsequence', 'string', 'memoization', 'dp'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
