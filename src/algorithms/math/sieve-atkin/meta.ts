import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sieve-atkin',
  categoryId: 'math',
  title: { zh: 'Atkin 筛', en: 'Sieve of Atkin' },
  summary: {
    zh: '基于二次型与模 12 余数的现代优化素数筛。',
    en: 'A modern optimized prime sieve using quadratic forms and mod-12 residues.',
  },
  description: {
    zh: 'Atkin 筛（2003）是对埃氏筛的优化，渐近复杂度 O(n/log log n)、并位运算友好。核心利用三条二次型的素数判据：对每个 (x,y)，n=4x²+y² 在模 12 余 1 或 5 时可能为素；n=3x²+y² 在模 12 余 7 时可能为素；n=3x²-y²（x>y）在模 12 余 11 时可能为素——对这些候选做翻转标记。最后对每个素数 r，把 r² 的倍数划为合数。本实现返回 [2,limit] 的全部素数。',
    en: 'The Sieve of Atkin (2003) optimizes the Sieve of Eratosthenes with asymptotic O(n/log log n) and bit-friendliness. It uses three quadratic-form criteria: n=4x²+y² with n mod 12 in {1,5}; n=3x²+y² with n mod 12 = 7; n=3x²-y² (x>y) with n mod 12 = 11; these candidates are flipped. Finally, multiples of r² for each prime r are marked composite. Returns all primes in [2, limit].',
  },
  tags: ['math', 'number-theory', 'prime', 'sieve', 'atkin'],
  complexity: { time: 'O(n/log log n)', space: 'O(n)' },
};
