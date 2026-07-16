import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-mod-3',
  categoryId: 'math',
  title: { zh: '模快速幂', en: 'Modular Exponentiation' },
  summary: {
    zh: '用反复平方在 O(log e) 内计算 (b^e) mod m。',
    en: 'Compute (b^e) mod m in O(log e) via repeated squaring.',
  },
  description: {
    zh: '将指数 e 拆为二进制位。每次平方 b，若该位为 1 则把当前结果乘上 b。所有运算 mod m。',
    en: 'Decompose exponent e in binary; square b each step; multiply result when bit is 1; everything mod m.',
  },
  tags: ['math', 'modular', 'fast-power'],
  complexity: { time: 'O(log e)', space: 'O(1)' },
};
