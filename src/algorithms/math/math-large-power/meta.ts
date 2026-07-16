import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-large-power',
  categoryId: 'math',
  title: { zh: '大数快速幂', en: 'Large Fast Power (BigInt)' },
  summary: {
    zh: '用 BigInt + 平方乘法精确计算 base^exp。',
    en: 'Compute base^exp exactly with BigInt exponentiation by squaring.',
  },
  description: {
    zh: '将指数按二进制分解，遇到 1 位即乘入结果，base 自平方迭代。时间 O(log exp) 次大整数乘法。',
    en: 'Decompose exponent in binary; square-and-multiply. O(log exp) BigInt multiplications.',
  },
  tags: ['math', 'power', 'bigint', 'number-theory'],
  complexity: { time: 'O(log exp · M)', space: 'O(M)' },
};
