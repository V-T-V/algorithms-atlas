// 快速模幂（Modular Exponentiation）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-modular-exp',
  categoryId: 'misc',
  title: { zh: '快速模幂', en: 'Modular Exponentiation' },
  summary: {
    zh: '计算 base^exp mod m，平方乘法 O(log exp)。',
    en: 'Compute base^exp mod m via square-and-multiply in O(log exp).',
  },
  description: {
    zh: '快速模幂：反复平方，遇 exp 二进制位为 1 则乘入结果。用于 RSA 等密码学。',
    en: 'Modular exp: repeated squaring, multiply result on each 1-bit of exp. Used in RSA.',
  },
  tags: ['misc', 'number-theory', 'modular'],
  complexity: { time: 'O(log exp)', space: 'O(1)' },
};
