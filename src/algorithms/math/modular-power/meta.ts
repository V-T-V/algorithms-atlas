// 模幂（Modular Power）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'modular-power',
  categoryId: 'math',
  title: { zh: '模幂（快速幂取模）', en: 'Modular Power (Fast Exponentiation mod m)' },
  summary: {
    zh: '用二进制拆指数快速计算 base^exp mod m，每步取模防溢出。',
    en: 'Compute base^exp mod m by binary-splitting the exponent, reducing mod m each step.',
  },
  description: {
    zh: '模幂是数论与密码学（RSA 等）的基础原语。把指数 exp 写成二进制，从低到高扫描每一位：每位让底数自乘平方，当该位为 1 时把当前底数累乘进结果。全程对 mod 取模，中间值始终落在 [0, mod)，避免溢出。时间 O(log exp)。',
    en: 'Modular exponentiation is a core primitive in number theory and cryptography (RSA). Write the exponent in binary and scan from LSB to MSB: square the base each step, and multiply it into the result when the bit is 1. Reducing mod m each step keeps all intermediates in [0, m), preventing overflow. Time O(log exp).',
  },
  tags: ['math', 'number-theory', 'modular', 'exponentiation'],
  complexity: { time: 'O(log exp)', space: 'O(1)' },
};
