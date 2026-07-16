// Gray Code · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gray-code',
  categoryId: 'bitwise',
  title: { zh: '格雷码', en: 'Gray Code' },
  summary: {
    zh: '格雷码属于bitwise类别。',
    en: 'Gray Code is a bitwise algorithm.',
  },
  description: {
    zh: '格雷码（Gray Code）属于bitwise类别的算法。',
    en: 'Gray Code is an algorithm in the bitwise category.',
  },
  tags: ["bitwise","bit-manipulation"],
  complexity: { time: 'O(2^n)', space: 'O(2^n)' },
};
