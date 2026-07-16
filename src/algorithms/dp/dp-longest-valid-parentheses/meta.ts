// Longest Valid Parentheses · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-longest-valid-parentheses',
  categoryId: 'dp',
  title: { zh: '最长有效括号', en: 'Longest Valid Parentheses' },
  summary: {
    zh: 'DP 求括号串中最长有效（正确配对）子串长度。',
    en: 'DP for the length of the longest valid (well-formed) parentheses substring.',
  },
  description: {
    zh: "给定只含 ( 和 ) 的串 s，求最长连续有效括号子串长度。dp[i] 表示以 s[i] 结尾的最长有效子串长度。若 s[i]==')' 且 s[i-1]=='('，dp[i]=dp[i-2]+2；若 s[i]==')' 且 s[i-1]==')' 且 s[i-dp[i-1]-1]=='('，dp[i]=dp[i-1]+2+dp[i-dp[i-1]-2]。时间 O(n)。",
    en: "Given a string of ( and ), find the longest contiguous valid substring. dp[i] = length of the longest valid substring ending at i. If s[i]=')' and s[i-1]='(' then dp[i]=dp[i-2]+2; if s[i]=')' and s[i-1]=')' and s[i-dp[i-1]-1]='(' then dp[i]=dp[i-1]+2+dp[i-dp[i-1]-2]. Time O(n).",
  },
  tags: ['dp', 'string', 'parentheses', 'linear'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
