// 末尾零个数 (ctz) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'trailing-zeros',
  categoryId: 'bitwise',
  title: { zh: '末尾零的个数 (ctz)', en: 'Count Trailing Zeros (ctz)' },
  summary: {
    zh: '最低位 1 之后的零个数，de Bruijn 序列实现。',
    en: 'Number of zeros after the lowest set bit; implemented via a de Bruijn sequence.',
  },
  description: {
    zh: 'ctz (count trailing zeros) 返回整数二进制表示中从最低位起连续 0 的个数，等价于「最低位 1 的位索引」。经典实现用 de Bruijn 序列：把 (x & -x) * 魔数 >> 27 后查一张 32 项表得到答案，全程无循环。0 的 ctz 约定为 32。',
    en: 'ctz (count trailing zeros) returns the number of consecutive zeros from the least significant bit upward — equivalently the bit index of the lowest set bit. A classic branchless implementation uses a de Bruijn sequence: multiply (x & -x) by a magic constant, shift right 27, and look up a 32-entry table. By convention ctz(0) = 32.',
  },
  tags: ['bitwise', 'ctz', 'de-bruijn'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
