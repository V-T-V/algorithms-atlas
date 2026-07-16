// Wichmann-Hill 生成器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-wichmann-hill',
  categoryId: 'randomized',
  title: { zh: 'Wichmann-Hill 随机数生成器', en: 'Wichmann-Hill RNG' },
  summary: {
    zh: '三个小模数 LCG 组合，周期约 6.95e12，适合 16 位时代。',
    en: 'Combines three small-modulus LCGs; period ≈ 6.95e12, popular in 16-bit era.',
  },
  description: {
    zh: 'Wichmann-Hill (1982) 组合三个模 30269/30307/30323 的 LCG，每次取三者归一化和 mod 1。周期 30269*30307*30323 ≈ 6.95e12。简单可移植。',
    en: 'Wichmann-Hill (1982) combines three LCGs mod 30269/30307/30323; output is the normalized sum mod 1. Period ≈ 6.95e12. Simple and portable.',
  },
  tags: ['randomized', 'prng', 'wichmann-hill', 'lcg'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
