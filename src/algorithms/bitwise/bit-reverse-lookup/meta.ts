// 查表位反转 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-reverse-lookup',
  categoryId: 'bitwise',
  title: { zh: '查表位反转', en: 'Bit Reverse (Lookup Table)' },
  summary: {
    zh: '用 256 项字节查表，逐字节反转 32 位整数。',
    en: 'Reverse a 32-bit integer byte-by-byte using a 256-entry lookup table.',
  },
  description: {
    zh: '位反转把一个整数的二进制位顺序颠倒（最高位↔最低位）。\n\n查表法：预计算 256 项表，给出每个字节值（0..255）的反转结果；对 32 位整数从低字节到高字节依次查表，并把结果左移 8 位拼接。\n\n复杂度 O(1)（固定 4 次查表）。与逐位反转等价，但更快。',
    en: 'Bit reversal mirrors the bit order of an integer. The lookup variant precomputes a 256-entry table of reversed bytes and reverses a 32-bit integer in 4 table lookups. O(1).',
  },
  tags: ['bitwise', 'reverse', 'lookup-table'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
