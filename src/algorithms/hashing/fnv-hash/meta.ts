// FNV-1a Hash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fnv-hash',
  categoryId: 'hashing',
  title: { zh: 'FNV-1a 哈希', en: 'FNV-1a Hash' },
  summary: {
    zh: '逐字节异或后再乘 FNV 素数，简单快速的非加密哈希。',
    en: 'XOR each byte then multiply by the FNV prime; a simple fast non-cryptographic hash.',
  },
  description: {
    zh: 'FNV-1a（Fowler–Noll–Vo 1a）是广为使用的非加密哈希函数。对每个字节先与当前哈希值异或，再乘以 FNV 素数（32 位为 16777619）。初始值为 offset basis（32 位为 2166136261）。算法极其简单（异或+乘法），分布均匀，常用于哈希表、校验、指纹。其确定性使同一输入永远给出同一 32 位输出。',
    en: 'FNV-1a (Fowler–Noll–Vo 1a) is a widely used non-cryptographic hash. For each byte it XORs the byte into the hash then multiplies by the FNV prime (16777619 for 32-bit). The initial value is the offset basis (2166136261 for 32-bit). The algorithm is extremely simple (XOR + multiply), distributes well, and is commonly used in hash tables, checksums, and fingerprints. It is deterministic: identical input always yields the same 32-bit output.',
  },
  tags: ['hashing', 'checksum', 'non-cryptographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
