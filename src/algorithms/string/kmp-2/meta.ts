// KMP (next-array variant) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kmp-2',
  categoryId: 'string',
  title: { zh: 'KMP（next 变体）', en: 'KMP (next-array variant)' },
  summary: {
    zh: 'KMP（next 变体）属于string类别。',
    en: 'KMP (next-array variant) is a string algorithm.',
  },
  description: {
    zh: 'KMP（next 变体）（KMP (next-array variant)）属于string类别的算法。',
    en: 'KMP (next-array variant) is an algorithm in the string category.',
  },
  tags: ["string","string-matching"],
  complexity: { time: 'O(n+m)', space: 'O(m)' },
};
