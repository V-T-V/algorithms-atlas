// Lehmer 随机数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-lehmer',
  categoryId: 'randomized',
  title: { zh: 'Lehmer 随机数生成器', en: 'Lehmer RNG' },
  summary: {
    zh: 'x_{n+1} = a * x_n mod m，MINSTD 常用 a=7^5=16807, m=2^31-1。',
    en: 'x_{n+1} = a * x_n mod m; MINSTD uses a=16807, m=2^31-1.',
  },
  description: {
    zh: 'Lehmer（乘性同余）是 LCG 的简化形式：仅乘法+取模，无增量。Park-Miller MINSTD (a=16807, m=2^31-1) 周期为 m-1，全周期，统计性质良好。用 Schrage 算法避免溢出。',
    en: "Lehmer (multiplicative congruential) is LCG without an increment: just multiply and mod. Park-Miller MINSTD (a=16807, m=2^31-1) has full period m-1 and good statistics. Schrage's method avoids overflow.",
  },
  tags: ['randomized', 'prng', 'lehmer', 'minstd'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
