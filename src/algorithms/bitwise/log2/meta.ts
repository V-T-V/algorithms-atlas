// Log2 Integer · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'log2',
  categoryId: 'bitwise',
  title: { zh: '整数 log2', en: 'Log2 Integer' },
  summary: {
    zh: '整数 log2属于bitwise类别。',
    en: 'Log2 Integer is a bitwise algorithm.',
  },
  description: {
    zh: '整数 log2（Log2 Integer）属于bitwise类别的算法。',
    en: 'Log2 Integer is an algorithm in the bitwise category.',
  },
  tags: ["bitwise"],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
