// Bitwise Add · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'add',
  categoryId: 'bitwise',
  title: { zh: '位运算加法', en: 'Bitwise Add' },
  summary: {
    zh: '位运算加法属于bitwise类别。',
    en: 'Bitwise Add is a bitwise algorithm.',
  },
  description: {
    zh: '位运算加法（Bitwise Add）属于bitwise类别的算法。',
    en: 'Bitwise Add is an algorithm in the bitwise category.',
  },
  tags: ["bitwise"],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
