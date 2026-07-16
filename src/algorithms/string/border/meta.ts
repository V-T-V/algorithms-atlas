// Border Array · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'border',
  categoryId: 'string',
  title: { zh: 'Border数组', en: 'Border Array' },
  summary: {
    zh: 'Border数组属于string类别。',
    en: 'Border Array is a string algorithm.',
  },
  description: {
    zh: 'Border数组（Border Array）属于string类别的算法。',
    en: 'Border Array is an algorithm in the string category.',
  },
  tags: ["string","sorting"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
