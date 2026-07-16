// Xorshift Generator · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'xorshift',
  categoryId: 'randomized',
  title: { zh: 'Xorshift 生成器', en: 'Xorshift Generator' },
  summary: {
    zh: '用三次异或移位产生伪随机数，速度快、状态小。',
    en: 'Generate pseudo-random numbers via three xor-shifts; fast with tiny state.',
  },
  description: {
    zh: 'Xorshift 族由 George Marsaglia 于 2003 年提出，利用异或（XOR）与移位（shift）的组合产生高质量伪随机数。本实现为 Xorshift128：维护 4 个 32 位状态字，每次输出执行 t = x ^ (x<<11)，然后旋转状态 w = w ^ (w>>19) ^ (t ^ (t>>8))。\n\n相比 LCG，Xorshift 的统计性质更好（周期 2¹²⁸−1），且每次仅需几次位运算，无需乘法/取模，在现代 CPU 上极快。全零状态是禁区，需用非零种子初始化。同一种子产生确定序列。',
    en: 'The Xorshift family, introduced by George Marsaglia in 2003, combines XOR and shift operations to produce high-quality pseudo-random numbers. This implementation is Xorshift128: it keeps four 32-bit state words and, on each draw, computes t = x ^ (x<<11) then rotates the state with w = w ^ (w>>19) ^ (t ^ (t>>8)).\n\nCompared to an LCG, Xorshift has better statistical properties (period 2¹²⁸−1) and needs only a handful of bitwise ops per draw—no multiply or modulo—making it very fast on modern CPUs. The all-zero state is forbidden, so a non-zero seed is required. The same seed yields a deterministic sequence.',
  },
  tags: ['randomized', 'prng', 'bitwise', 'simulation'],
  complexity: { time: 'O(1) per draw', space: 'O(1)' },
};
