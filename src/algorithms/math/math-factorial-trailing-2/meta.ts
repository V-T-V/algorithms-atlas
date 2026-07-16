import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-factorial-trailing-2',
  categoryId: 'math',
  title: { zh: '阶乘尾部零（高精度）', en: 'Factorial Trailing Zeros (Legendre)' },
  summary: {
    zh: '统计 n! 末尾 0 的个数（即 n! 中 5 的幂次）。',
    en: 'Count trailing zeros of n! (exponent of prime 5 in n!).',
  },
  description: {
    zh: '由 Legendre 公式，v_5(n!) = ⌊n/5⌋ + ⌊n/25⌋ + ... 直到除尽。时间 O(log n)，空间 O(1)。',
    en: "By Legendre's formula sum floor(n/5^k). Time O(log n), space O(1).",
  },
  tags: ['math', 'factorial', 'number-theory'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
