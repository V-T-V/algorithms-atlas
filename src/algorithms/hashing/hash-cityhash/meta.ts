// hash-cityhash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-cityhash',
  categoryId: 'hashing',
  title: { zh: 'CityHash', en: 'CityHash' },
  summary: {
    zh: 'CityHash64：Google 为短字符串优化的 64 位哈希，被用于 hash 表分桶。',
    en: 'CityHash64: Google-optimized 64-bit hash for short strings, used for hash table bucketing.',
  },
  description: {
    zh: 'CityHash（Pike & Alakuijala）：\n\n- 针对 ≤16 字节和长字符串分别走不同路径。\n- 使用 SIMD 风格的乘法混合（kMul=0x9ddfea08eb382d69）。\n- 主要用于服务器端哈希表，比 MurmurHash 更快但不抗碰撞攻击。',
    en: 'CityHash (Pike & Alakuijala):\n\n- Different paths for <=16-byte and long inputs.\n- SIMD-style multiplicative mixing (kMul=0x9ddfea08eb382d69).\n- Aimed at server-side hash tables, faster than MurmurHash but not DoS-resistant.',
  },
  tags: ['hashing', 'non-cryptographic', 'cityhash'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
