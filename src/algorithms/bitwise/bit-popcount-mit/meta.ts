// MIT 位计数（MIT Hackers' Delight）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-popcount-mit',
  categoryId: 'bitwise',
  title: { zh: 'MIT 位计数', en: 'MIT Population Count' },
  summary: {
    zh: "MIT Hacker's Delight 的高效 popcount 变种，乘法累加到结果。",
    en: "MIT Hacker's Delight popcount variant that multiply-accumulates to the result.",
  },
  description: {
    zh: "MIT 位计数是 SWAR popcount 的经典实现（出自 Hacker's Delight）：\n\n```\nx = x - ((x >>> 1) & 0x55555555)\nx = (x & 0x33333333) + ((x >>> 2) & 0x33333333)\nx = (x + (x >>> 4)) & 0x0f0f0f0f\nreturn (x * 0x01010101) >>> 24\n```\n\n与并行 popcount 同族，区别在中间步骤的等价写法。常数级 O(1)。",
    en: "The MIT population count (from Hacker's Delight) is a classic SWAR popcount. It folds bits pairwise, then into nibbles, bytes, and finally multiply-accumulates with 0x01010101. Constant time O(1) for a 32-bit integer.",
  },
  tags: ['bitwise', 'popcount', 'swar'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
