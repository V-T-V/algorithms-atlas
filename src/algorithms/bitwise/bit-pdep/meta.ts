// PDEP 位放置 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-pdep',
  categoryId: 'bitwise',
  title: { zh: 'PDEP 位放置', en: 'PDEP (Parallel Bit Deposit)' },
  summary: {
    zh: 'BMI2 PDEP：把 x 的低位并行散布到掩码 m 为 1 的位置。',
    en: 'BMI2 PDEP: parallel-deposit the low bits of x into positions where mask m is 1.',
  },
  description: {
    zh: 'PDEP（Parallel Bit Deposit，BMI2 指令）把源 x 的低位按顺序散布到结果中、掩码 m 为 1 的位置上。\n\n本实现为纯软件等价：用 `m & -m`（最低位 1）逐位定位 m 的每个 1，依次从 x 的低位取位放入。\n\n与 PEXT（bit-pext）互为逆运算。复杂度 O(k)，k 为 m 中 1 的个数。',
    en: 'PDEP (Parallel Bit Deposit, BMI2) scatters the low bits of x into the positions of m that are 1, in order. This is a software-equivalent using m & -m to locate each set bit. Inverse of PEXT (bit-pext). O(k) where k = popcount(m).',
  },
  tags: ['bitwise', 'pdep', 'bmi2', 'scatter'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
