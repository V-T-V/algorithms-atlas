// PEXT 位提取 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-pext',
  categoryId: 'bitwise',
  title: { zh: 'PEXT 位提取', en: 'PEXT (Parallel Bit Extract)' },
  summary: {
    zh: 'BMI2 PEXT：把 x 中掩码 m 为 1 的位并行压缩到低位。',
    en: 'BMI2 PEXT: parallel-extract bits of x selected by mask m into the low bits.',
  },
  description: {
    zh: 'PEXT（Parallel Bit Extract，BMI2 指令）把源 x 中、掩码 m 为 1 的位置上的位，按位置顺序压缩到结果的连续低位。\n\n本实现为纯软件等价：用 `m & -m`（最低位 1）逐位定位 m 的每个 1，依次取 x 的相应位。\n\n与 PDEP（bit-pdep）互为逆运算。复杂度 O(k)，k 为 m 中 1 的个数。',
    en: 'PEXT (Parallel Bit Extract, BMI2) gathers the bits of x at positions where m is 1 into contiguous low bits of the result. This is a software-equivalent using m & -m to locate each set bit. Inverse of PDEP (bit-pdep). O(k) where k = popcount(m).',
  },
  tags: ['bitwise', 'pext', 'bmi2', 'gather'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
