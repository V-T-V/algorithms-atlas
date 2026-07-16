// Longest Common Subsequence · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lcs',
  categoryId: 'dp',
  title: { zh: '最长公共子序列', en: 'Longest Common Subsequence' },
  summary: {
    zh: '最长公共子序列属于dp类别。',
    en: 'Longest Common Subsequence is a dp algorithm.',
  },
  description: {
    zh: '最长公共子序列（Longest Common Subsequence）属于dp类别的算法。',
    en: 'Longest Common Subsequence is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
};
