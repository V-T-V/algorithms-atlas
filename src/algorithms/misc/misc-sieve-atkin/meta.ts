// Atkin 筛（Sieve of Atkin）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-sieve-atkin',
  categoryId: 'misc',
  title: { zh: 'Atkin 筛', en: 'Sieve of Atkin' },
  summary: {
    zh: '用二次型翻转标志位筛素数，比 Eratosthenes 更快（理论）。',
    en: 'Flips flags via quadratic forms to sieve primes; theoretically faster than Eratosthenes.',
  },
  description: {
    zh: 'Atkin 筛：对 (x,y) 满足 4x²+y²、3x²+y²、3x²-y² 的 n 翻转标志，最后平方数倍数置假。',
    en: 'Atkin sieve: for (x,y) satisfying 4x²+y², 3x²+y², 3x²-y² flip n; then mark multiples of primes square as false.',
  },
  tags: ['misc', 'number-theory', 'prime', 'sieve'],
  complexity: { time: 'O(n / log log n)', space: 'O(n)' },
};
