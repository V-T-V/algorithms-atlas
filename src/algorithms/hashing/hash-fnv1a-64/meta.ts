// FNV-1a 64 位 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-fnv1a-64',
  categoryId: 'hashing',
  title: { zh: 'FNV-1a 64 位', en: 'FNV-1a 64-bit' },
  summary: {
    zh: 'FNV-1a 64 位：逐字节 hash=(hash^byte)*prime，用 BigInt。',
    en: 'FNV-1a 64-bit: per byte hash=(hash^byte)*prime, using BigInt.',
  },
  description: {
    zh: 'Fowler-Noll-Vo 1a 64 位哈希：offset=14695981039346656037n、prime=1099511628211n。每字节 hash=(hash XOR byte) * prime mod 2^64。',
    en: 'Fowler-Noll-Vo 1a 64-bit hash: offset=14695981039346656037n, prime=1099511628211n. Per byte hash=(hash XOR byte) * prime mod 2^64.',
  },
  tags: ['hashing', 'non-crypto', 'fnv'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
