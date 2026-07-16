// Rabin 指纹（Rabin Fingerprint）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-fingerprint-rabin',
  categoryId: 'hashing',
  title: { zh: 'Rabin 指纹', en: 'Rabin Fingerprint' },
  summary: {
    zh: '把串视作多项式对不可约多项式取模，理论可证低碰撞。',
    en: 'Treat string as a polynomial mod an irreducible one; provably low collisions.',
  },
  description: {
    zh: 'Rabin 指纹：串 s 映射为多项式，对不可约多项式 P(x) 取模。在 GF(2) 上运算，碰撞概率 = 1/|P|。',
    en: 'Rabin fingerprint: map string to polynomial, mod irreducible P(x) over GF(2). Collision prob = 1/|P|.',
  },
  tags: ['hashing', 'fingerprint', 'polynomial'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
