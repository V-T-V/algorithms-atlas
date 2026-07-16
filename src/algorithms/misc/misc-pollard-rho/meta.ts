// Pollard Rho 分解（Pollard Rho Factorization）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-pollard-rho',
  categoryId: 'misc',
  title: { zh: 'Pollard Rho 分解', en: 'Pollard Rho Factorization' },
  summary: {
    zh: '用伪随机序列与 Floyd 环检测找合数的非平凡因子，O(√p)。',
    en: 'Pseudorandom sequence + Floyd cycle detection finds a nontrivial factor in O(√p).',
  },
  description: {
    zh: 'Pollard Rho：x_{i+1}=(x_i²+c) mod n，gcd(|x_i-x_j|,n) 非 1 即得因子。',
    en: 'Pollard Rho: x_{i+1}=(x_i²+c) mod n; gcd(|x_i-x_j|,n) nontrivial yields a factor.',
  },
  tags: ['misc', 'number-theory', 'factorization'],
  complexity: { time: 'O(n^(1/4))', space: 'O(1)' },
};
