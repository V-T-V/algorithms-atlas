// Single Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'single-number',
  categoryId: 'bitwise',
  title: { zh: '只出现一次的数', en: 'Single Number' },
  summary: {
    zh: '只出现一次的数属于bitwise类别。',
    en: 'Single Number is a bitwise algorithm.',
  },
  description: {
    zh: '只出现一次的数（Single Number）属于bitwise类别的算法。',
    en: 'Single Number is an algorithm in the bitwise category.',
  },
  tags: ["bitwise"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
