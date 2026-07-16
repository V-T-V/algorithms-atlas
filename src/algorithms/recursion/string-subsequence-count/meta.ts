// 递归统计子序列出现次数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'string-subsequence-count',
  categoryId: 'recursion',
  title: { zh: '递归统计子序列出现次数', en: 'Subsequence Occurrence Count' },
  summary: {
    zh: '统计 t 作为 s 子序列在 s 中出现的次数（递归双指针）。',
    en: 'Count how many times t occurs as a subsequence of s (recursive two-pointer).',
  },
  description: {
    zh: '问题：给定字符串 s 和模式 t，统计 t 作为 s 的子序列在 s 中出现的次数（不同下标选取算不同）。递归定义：\n- count(s, t, i, j)：s 的前 i 个字符、t 的前 j 个字符\n- 若 j == 0（t 空）：返回 1\n- 若 i == 0 且 j > 0：返回 0\n- 若 s[i−1] == t[j−1]：count = count(i−1, j−1) + count(i−1, j)（用或不用 s[i−1]）\n- 否则：count = count(i−1, j)\n\n朴素递归指数级；可用记忆化或本实现的直接递归（小规模教学）。结果可能很大。',
    en: 'Count t as a subsequence of s. Recurrence: if s[i-1]==t[j-1], count(i,j) = count(i-1,j-1) + count(i-1,j) (use or skip); else count(i,j)=count(i-1,j). Base j=0 returns 1, i=0 & j>0 returns 0. Naive recursion is exponential; this teaching version uses memoization.',
  },
  tags: ['recursion', 'string', 'subsequence', 'dp', 'memoization'],
  complexity: { time: 'O(|s|·|t|)', space: 'O(|s|·|t|)' },
};
