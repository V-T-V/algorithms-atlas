// Suffix Array · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'suffix-array',
  categoryId: 'string',
  title: { zh: '后缀数组', en: 'Suffix Array' },
  summary: {
    zh: '后缀数组属于string类别。',
    en: 'Suffix Array is a string algorithm.',
  },
  description: {
    zh: '后缀数组（Suffix Array）属于string类别的算法。',
    en: 'Suffix Array is an algorithm in the string category.',
  },
  tags: ["string","suffix-structure"],
  complexity: { time: 'O(n log² n)', space: 'O(n)' },
};
