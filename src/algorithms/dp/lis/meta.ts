// Longest Increasing Subsequence · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lis',
  categoryId: 'dp',
  title: { zh: '最长递增子序列', en: 'Longest Increasing Subsequence' },
  summary: {
    zh: '最长递增子序列属于dp类别。',
    en: 'Longest Increasing Subsequence is a dp algorithm.',
  },
  description: {
    zh: '最长递增子序列（Longest Increasing Subsequence）属于dp类别的算法。',
    en: 'Longest Increasing Subsequence is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
