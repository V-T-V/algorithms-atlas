// 素数间隙（Prime Gap）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-prime-gap',
  categoryId: 'misc',
  title: { zh: '素数间隙', en: 'Prime Gap' },
  summary: {
    zh: '相邻素数之差，分析最大间隙分布与孪生素数。',
    en: 'Difference between consecutive primes; analyze max gap and twin primes.',
  },
  description: {
    zh: '素数间隙：g_n = p_{n+1} - p_n。孪生素数对应 g=2。筛出范围内素数计算间隙。',
    en: 'Prime gap: g_n = p_{n+1} - p_n. Twin primes give g=2. Sieve primes in range, compute gaps.',
  },
  tags: ['misc', 'number-theory', 'prime'],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
