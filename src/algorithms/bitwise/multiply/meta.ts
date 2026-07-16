// Bitwise Multiply · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'multiply',
  categoryId: 'bitwise',
  title: { zh: '位运算乘法', en: 'Bitwise Multiply' },
  summary: {
    zh: '位运算乘法属于bitwise类别。',
    en: 'Bitwise Multiply is a bitwise algorithm.',
  },
  description: {
    zh: '位运算乘法（Bitwise Multiply）属于bitwise类别的算法。',
    en: 'Bitwise Multiply is an algorithm in the bitwise category.',
  },
  tags: ["bitwise"],
  complexity: { time: 'O(log b)', space: 'O(1)' },
};
