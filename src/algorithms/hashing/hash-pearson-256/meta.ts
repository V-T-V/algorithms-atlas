// Pearson 256（Pearson Hash 256）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-pearson-256',
  categoryId: 'hashing',
  title: { zh: 'Pearson 256', en: 'Pearson Hash 256' },
  summary: {
    zh: '用 256 字节随机表逐字节异或查表，单遍快速生成 8 位哈希。',
    en: 'XOR-lookup against a 256-byte random table; single-pass fast 8-bit hash.',
  },
  description: {
    zh: 'Pearson：h=0；每字节 h=T[h XOR byte]。表 T 是 0..255 的随机置换。可扩展为多字节输出。',
    en: 'Pearson: h=0; per byte h=T[h XOR byte]. T is a permutation of 0..255. Extensible to multi-byte output.',
  },
  tags: ['hashing', 'non-cryptographic', 'pearson'],
  complexity: { time: 'O(n)', space: 'O(256)' },
};
