// 并行 Popcount · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-popcount-parallel',
  categoryId: 'bitwise',
  title: { zh: '并行位计数', en: 'Parallel Population Count' },
  summary: {
    zh: 'SWAR（SIMD Within A Register）并行位计数，常数级 32 位 popcount。',
    en: 'SWAR parallel population count, a constant-time 32-bit popcount.',
  },
  description: {
    zh: '并行位计数（又称 SWAR popcount）通过一系列位运算，在常数步内统计 32 位整数中 1 的个数。\n\n核心步骤（对 32 位 x）：\n1. 把每 2 位一组的计数合并：`x = x - ((x >>> 1) & 0x55555555)`\n2. 把每 4 位一组的计数合并：`x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)`\n3. 每 8 位一组：`x = (x + (x >>> 4)) & 0x0f0f0f0f`\n4. 乘以 `0x01010101` 把 4 个字节累加到最高字节，再右移 24 位。\n\n总操作数为常数（约 12 条指令），故为 O(1)（对固定位宽整数）。',
    en: 'Parallel population count (SWAR) counts the 1-bits of a 32-bit integer in a constant number of operations using a sequence of SWAR bit-manipulation steps: pair, nibble, byte, and finally multiply-accumulate via 0x01010101.\n\nIt is O(1) for a fixed-width integer (about 12 instructions total).',
  },
  tags: ['bitwise', 'popcount', 'swar', 'constant-time'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
