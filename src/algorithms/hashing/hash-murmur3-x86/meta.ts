// Murmur3 x86（MurmurHash3 x86）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-murmur3-x86',
  categoryId: 'hashing',
  title: { zh: 'Murmur3 x86', en: 'MurmurHash3 x86' },
  summary: {
    zh: '高性能非加密哈希：种子+混合+最终雪崩，广泛用于哈希表。',
    en: 'High-perf non-crypto hash: seed + mix + final avalanche; widely used in hash tables.',
  },
  description: {
    zh: 'MurmurHash3 x86_32：分 4 字节块处理，每块 c1 旋转 c2 混合，尾部 finalizer fmix32 雪崩。',
    en: 'MurmurHash3 x86_32: process 4-byte blocks with c1/c2 rotate mix; tail handled; fmix32 finalizer avalanche.',
  },
  tags: ['hashing', 'non-cryptographic', 'murmur'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
