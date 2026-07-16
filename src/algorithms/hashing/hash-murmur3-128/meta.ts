// MurmurHash3 128 位 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-murmur3-128',
  categoryId: 'hashing',
  title: { zh: 'MurmurHash3 128 位', en: 'MurmurHash3 128-bit' },
  summary: {
    zh: 'MurmurHash3 x64 128 位变体，用一对 64 位状态输出 128 位哈希。',
    en: 'MurmurHash3 x64 128-bit variant using a pair of 64-bit states to emit a 128-bit hash.',
  },
  description: {
    zh: 'MurmurHash3 x64 128 位（Austin Appleby）：\n\n- 维护两个 64 位状态 h1/h2。\n- 每 16 字节一块，拆成两个 64 位小端整数，经 multiply-rotate-xor 混合后并入 h1/h2。\n- 尾部字节单独处理，最后做终态混合（fmix64 风格）。\n- 输出 128 位 (h1, h2)。本实现用 BigInt 表达 64 位运算。',
    en: 'MurmurHash3 x64 128-bit (Austin Appleby):\n\n- Maintain two 64-bit states h1/h2.\n- Each 16-byte block splits into two little-endian 64-bit ints, mixed via multiply-rotate-xor into h1/h2.\n- Tail bytes are handled separately; final mixing (fmix64-style) follows.\n- Output 128 bits (h1, h2). This implementation uses BigInt for 64-bit ops.',
  },
  tags: ['hashing', 'non-cryptographic', 'murmur'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
