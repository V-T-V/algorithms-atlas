// LCP Array · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'longest-common-prefix',
  categoryId: 'dp',
  title: { zh: '最长公共前缀', en: 'LCP Array' },
  summary: {
    zh: '最长公共前缀属于dp类别。',
    en: 'LCP Array is a dp algorithm.',
  },
  description: {
    zh: '最长公共前缀（LCP Array）属于dp类别的算法。',
    en: 'LCP Array is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
