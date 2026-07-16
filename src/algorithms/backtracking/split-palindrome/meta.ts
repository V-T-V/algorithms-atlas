// 分割回文串 II（Palindrome Partitioning II）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'split-palindrome',
  categoryId: 'backtracking',
  title: { zh: '分割回文串 II', en: 'Palindrome Partitioning II' },
  summary: {
    zh: '把字符串分割成若干回文子串，求最少分割次数。',
    en: 'Partition a string into palindromes with the minimum number of cuts.',
  },
  description: {
    zh: '给定一个字符串 s，把它分割成若干子串，使每个子串都是回文。求最少的分割次数。\n\n方法：先用区间 DP 预处理「isPal[i][j] = s[i..j] 是否为回文」，再用 dp[i] 表示 s[0..i] 的最少分割次数。转移：dp[i] = min(dp[j-1] + 1)，对所有 j 使 s[j..i] 为回文。本实现采用「回溯 + 记忆化」视角：以分割点为决策，沿当前路径推进，记录到达每个右端点时的最少次数。也可视为回溯展开的最短路。',
    en: 'Given a string s, partition it into substrings each of which is a palindrome, minimizing the number of cuts.\n\nMethod: precompute isPal[i][j] via interval DP, then dp[i] = minimum cuts for s[0..i]. Transition: dp[i] = min(dp[j-1] + 1) over all j where s[j..i] is a palindrome. This implementation takes a backtracking + memoization view: decisions are cut points, advancing along the path and recording the minimum cuts to reach each right endpoint — equivalent to shortest-path on the backtracking tree.',
  },
  tags: ['backtracking', 'palindrome', 'dp', 'memoization'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
  references: [
    { label: 'LeetCode 132', url: 'https://leetcode.com/problems/palindrome-partitioning-ii/' },
  ],
  defaultInput: 'aab',
};
