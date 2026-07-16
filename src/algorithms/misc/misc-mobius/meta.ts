// Möbius 函数（Mobius Function）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-mobius',
  categoryId: 'misc',
  title: { zh: 'Möbius 函数', en: 'Mobius Function' },
  summary: {
    zh: 'μ(n)：无平方因子且 k 个素因子时 (-1)^k，否则 0，用于莫比乌斯反演。',
    en: 'mu(n): (-1)^k if square-free with k prime factors, else 0; for Mobius inversion.',
  },
  description: {
    zh: 'Möbius：μ(n)=0 若 n 含平方因子；否则 (-1)^k，k 为素因子个数。',
    en: 'Mobius: mu=0 if n has a square factor; else (-1)^k where k is number of prime factors.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
