import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-mobius-3',
  categoryId: 'math',
  title: { zh: 'Möbius 函数（线性筛）', en: 'Mobius Function (Linear Sieve)' },
  summary: {
    zh: '线性筛求 μ(1..n)：素数为 -1，含平方因子为 0，否则为 (-1)^k。',
    en: 'Linear sieve for μ(1..n): -1 for primes, 0 if square factor present, else (-1)^k.',
  },
  description: {
    zh: 'μ(1)=1；μ(p)=-1；μ(p^2·m)=0；μ(p·m)=-μ(m)。线性筛时按最小质因子更新。',
    en: 'μ(1)=1; μ(p)=-1; μ(p²·m)=0; μ(p·m)=-μ(m). Update via smallest prime factor in linear sieve.',
  },
  tags: ['math', 'mobius', 'sieve'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
