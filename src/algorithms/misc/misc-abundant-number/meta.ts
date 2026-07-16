// 过剩数判定（Abundant Number）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-abundant-number',
  categoryId: 'misc',
  title: { zh: '过剩数判定', en: 'Abundant Number' },
  summary: {
    zh: '真因子和大于自身的数，如 12，与完美数/亏数互补。',
    en: 'A number whose proper-divisor sum exceeds itself, e.g. 12; complement of deficient/perfect.',
  },
  description: {
    zh: '过剩数：σ(n)-n > n 即 σ(n)>2n。最小的过剩数是 12。',
    en: 'Abundant: σ(n)-n > n i.e. σ(n)>2n. Smallest is 12.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
