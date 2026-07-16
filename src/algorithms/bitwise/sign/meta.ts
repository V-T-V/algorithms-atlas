// Bitwise Sign · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sign',
  categoryId: 'bitwise',
  title: { zh: '位运算符号', en: 'Bitwise Sign' },
  summary: {
    zh: '位运算符号属于bitwise类别。',
    en: 'Bitwise Sign is a bitwise algorithm.',
  },
  description: {
    zh: '位运算符号（Bitwise Sign）属于bitwise类别的算法。',
    en: 'Bitwise Sign is an algorithm in the bitwise category.',
  },
  tags: ["bitwise"],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
