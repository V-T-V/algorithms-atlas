// Jenkins One-at-a-Time · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-jenkins-2',
  categoryId: 'hashing',
  title: { zh: 'Jenkins One-at-a-Time', en: 'Jenkins One-at-a-Time' },
  summary: {
    zh: 'Bob Jenkins 的 32 位逐字节哈希：每字节加+移位混合。',
    en: 'Bob Jenkins 32-bit per-byte hash: each byte added then mixed by shifts.',
  },
  description: {
    zh: 'Jenkins One-at-a-Time 32 位哈希：每字节 hash += byte; hash += hash<<10; hash ^= hash>>6；末尾再混合。',
    en: 'Jenkins One-at-a-Time 32-bit: per byte hash += byte; hash += hash<<10; hash ^= hash>>6; final mixing avalanche.',
  },
  tags: ['hashing', 'non-crypto', 'jenkins'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
