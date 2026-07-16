import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-mod-inv-3',
  categoryId: 'math',
  title: { zh: '模逆元（费马小定理）', en: 'Modular Inverse (Fermat)' },
  summary: {
    zh: '当模数 p 为素数时，a^(p-2) mod p 即为 a 的乘法逆元。',
    en: 'When modulus p is prime, a^(p-2) mod p gives the multiplicative inverse of a.',
  },
  description: {
    zh: '费马小定理：a^(p-1)≡1 mod p，故 a·a^(p-2)≡1，逆元 = a^(p-2) mod p。需 p 为素数且 a 不被 p 整除。',
    en: "Fermat's little theorem: a^(p-1)≡1 mod p, so inverse = a^(p-2) mod p. Requires prime p and gcd(a,p)=1.",
  },
  tags: ['math', 'modular-inverse', 'fermat'],
  complexity: { time: 'O(log p)', space: 'O(1)' },
};
