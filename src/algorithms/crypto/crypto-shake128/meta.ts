// SHAKE128（SHAKE128）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-shake128',
  categoryId: 'crypto',
  title: { zh: 'SHAKE128', en: 'SHAKE128' },
  summary: {
    zh: 'SHAKE128：基于 Keccak 的可扩展输出函数（XOF）。',
    en: 'SHAKE128: Keccak-based extendable output function (XOF).',
  },
  description: {
    zh: 'SHAKE128（NIST FIPS 202）基于 Keccak-f[1600] 海绵结构，输出长度任意。capacity=256 位，rate=1344 位。',
    en: 'SHAKE128 (NIST FIPS 202) is a Keccak-f[1600] sponge with arbitrary output length; capacity = 256 bits, rate = 1344 bits.',
  },
  tags: ['crypto', 'shake', 'keccak', 'xof', 'sponge'],
  complexity: { time: 'O(n + out)', space: 'O(1)' },
};
