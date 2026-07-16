// MurmurHash2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-murmur2',
  categoryId: 'hashing',
  title: { zh: 'MurmurHash2', en: 'MurmurHash2' },
  summary: {
    zh: 'Austin Lee Bykov 的 MurmurHash2：32 位非加密、按 4 字节块混合 m=0x5bd1e995。',
    en: 'Austin Lee Bykov MurmurHash2: 32-bit non-crypto, 4-byte chunks mixed with m=0x5bd1e995.',
  },
  description: {
    zh: 'MurmurHash2：种子 seed、乘子 m=0x5bd1e995、移位 r=24。每 4 字节块乘+移位+XOR 累加，最后再混合。',
    en: 'MurmurHash2: seed, multiplier m=0x5bd1e995, shift r=24. Each 4-byte chunk is multiply/shift/XOR-accumulated, then finalized.',
  },
  tags: ['hashing', 'non-crypto', 'murmur'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
