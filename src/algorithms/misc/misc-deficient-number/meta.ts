// 亏数判定（Deficient Number）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-deficient-number',
  categoryId: 'misc',
  title: { zh: '亏数判定', en: 'Deficient Number' },
  summary: {
    zh: '真因子和小于自身的数，大多数自然数为亏数。',
    en: 'A number whose proper-divisor sum is less than itself; most naturals are deficient.',
  },
  description: {
    zh: '亏数：σ(n)-n < n 即 σ(n)<2n。所有素数都是亏数。',
    en: 'Deficient: σ(n)-n < n i.e. σ(n)<2n. All primes are deficient.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
