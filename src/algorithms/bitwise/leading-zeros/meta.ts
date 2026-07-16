// 前导零个数 (clz) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'leading-zeros',
  categoryId: 'bitwise',
  title: { zh: '前导零的个数 (clz)', en: 'Count Leading Zeros (clz)' },
  summary: {
    zh: '最高位 1 之前的零个数，二分法实现。',
    en: 'Number of zeros before the highest set bit; via binary search.',
  },
  description: {
    zh: 'clz (count leading zeros) 返回 32 位整数中从最高位起连续 0 的个数。本实现用「逐层二分右移」的无循环版本：依次检查高 16、8、4、2、1 位是否为 0，累加得到前导零数。0 的 clz 约定为 32。它是计算 ⌈log2 n⌉ 的常用基础。',
    en: 'clz (count leading zeros) returns the number of consecutive zeros from the most significant bit of a 32-bit integer. This implementation uses a branchless binary-shrink version: check the top 16, 8, 4, 2, 1 bits in turn and accumulate. By convention clz(0) = 32. It is the usual primitive for computing ⌈log2 n⌉.',
  },
  tags: ['bitwise', 'clz', 'binary-search'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
