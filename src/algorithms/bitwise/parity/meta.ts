// Parity Check · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parity',
  categoryId: 'bitwise',
  title: { zh: '奇偶校验', en: 'Parity Check' },
  summary: {
    zh: '奇偶校验属于bitwise类别。',
    en: 'Parity Check is a bitwise algorithm.',
  },
  description: {
    zh: '奇偶校验（Parity Check）属于bitwise类别的算法。',
    en: 'Parity Check is an algorithm in the bitwise category.',
  },
  tags: ["bitwise"],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
