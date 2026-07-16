// 判断 4 的幂 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'is-power-of-four',
  categoryId: 'bitwise',
  title: { zh: '判断是否 4 的幂', en: 'Check Power of Four' },
  summary: {
    zh: '是 2 的幂且唯一 1 位落在偶数位。',
    en: 'A power of two whose single 1-bit sits on an even position.',
  },
  description: {
    zh: '判断 n 是否 4 的幂：首先 n>0 且只有一位 1（n & (n-1) == 0，即 2 的幂），其次该 1 必须落在偶数位（位 0,2,4,…）。后者用掩码 0x55555555（二进制 0101…01）测试：n & mask != 0。两个条件同时满足即 4 的幂。',
    en: 'To test whether n is a power of four: n>0 and has a single 1-bit (n & (n-1) == 0, i.e. a power of two), and that bit must sit on an even position (bit 0,2,4,…). The latter is checked with the mask 0x55555555 (binary 0101…01): n & mask != 0. Both conditions together mean a power of four.',
  },
  tags: ['bitwise', 'predicate'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
