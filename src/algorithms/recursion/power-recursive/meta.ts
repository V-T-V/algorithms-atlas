// 递归快速幂 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'power-recursive',
  categoryId: 'recursion',
  title: { zh: '递归快速幂', en: 'Recursive Fast Exponentiation' },
  summary: {
    zh: '分治地算 a^n：偶数次平方、奇数次乘一次，O(log n) 次乘法。',
    en: 'Divide-and-conquer a^n: square on even, multiply once on odd; O(log n) multiplications.',
  },
  description: {
    zh: '快速幂用递归把 a^n 化简：\n\n- n == 0 → 1\n- n 为偶数 → (a^(n/2))²\n- n 为奇数 → a · a^(n-1)\n\n每层把指数减半，递归深度 O(log n)。可带模数 m 做模幂（用于 RSA、费马小定理等），全程在 [0, m) 内防溢出。',
    en: 'Fast exponentiation recursively reduces a^n:\n\n- n == 0 → 1\n- n even → (a^(n/2))²\n- n odd → a · a^(n-1)\n\nEach level halves the exponent, depth O(log n). An optional modulus m gives modular exponentiation (RSA, Fermat) keeping values in [0, m) to avoid overflow.',
  },
  tags: ['recursion', 'divide-and-conquer', 'number-theory'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
