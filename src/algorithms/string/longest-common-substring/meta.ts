// Longest Common Substring · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'longest-common-substring',
  categoryId: 'string',
  title: { zh: '最长公共子串', en: 'Longest Common Substring' },
  summary: {
    zh: '最长公共子串属于string类别。',
    en: 'Longest Common Substring is a string algorithm.',
  },
  description: {
    zh: '最长公共子串（Longest Common Substring）属于string类别的算法。',
    en: 'Longest Common Substring is an algorithm in the string category.',
  },
  tags: ["string","tree"],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
};
