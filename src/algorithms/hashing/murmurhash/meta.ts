// MurmurHash3 (32-bit) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'murmurhash',
  categoryId: 'hashing',
  title: { zh: 'MurmurHash3 (32 位)', en: 'MurmurHash3 (32-bit)' },
  summary: {
    zh: '「乘 + 旋转 + 异或」的非加密哈希，分布均匀，广泛用于哈希表。',
    en: 'A non-cryptographic "multiply-rotate-xor" hash with uniform distribution, widely used in hash tables.',
  },
  description: {
    zh: 'MurmurHash3 由 Austin Appleby 设计，是高性能非加密哈希函数族。"Murmur" 来自其核心运算 IMUL（multiply）与 rotate 的组合：每处理 4 字节块就做 c1 常量乘、左旋转 15 位、c2 常量乘，再混入累计哈希并再次旋转 13 位。尾部不足 4 字节单独处理。最后做 fmix32 终结混合（连续的右移异或与乘常量），消除低位聚集。32 位版本输出单个 32 位值，分布均匀、雪崩性好，是 Google CityHash / FarmHash、LevelDB 等的基石。',
    en: 'MurmurHash3, designed by Austin Appleby, is a family of high-performance non-cryptographic hashes. The name "Murmur" comes from its core IMUL (multiply) and rotate operations: each 4-byte block is multiplied by constant c1, left-rotated 15 bits, multiplied by constant c2, then mixed into the running hash which is again rotated 13 bits. Trailing bytes (<4) are handled separately. Finally an fmix32 finalizer (successive shift-XORs and constant multiplications) diffuses the bits and removes low-bit clustering. The 32-bit variant outputs a single 32-bit value with uniform distribution and good avalanche properties, underpinning Google\'s CityHash/FarmHash and LevelDB.',
  },
  tags: ['hashing', 'non-cryptographic', 'checksum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
