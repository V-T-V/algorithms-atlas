// 布隆过滤器（Bloom Filter）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-bloom-test',
  categoryId: 'hashing',
  title: { zh: '布隆过滤器', en: 'Bloom Filter' },
  summary: {
    zh: '位数组+k 个哈希，空间高效成员查询，有假阳性无假阴性。',
    en: 'Bit array + k hashes; space-efficient membership with false positives, no false negatives.',
  },
  description: {
    zh: '布隆过滤器：m 位+ k 个哈希。插入置 k 位，查询全 1 才可能存在。假阳性率 ≈ (1-e^(-kn/m))^k。',
    en: 'Bloom filter: m bits + k hashes. Insert sets k bits; query all-1 means maybe present. FP rate ≈ (1-e^(-kn/m))^k.',
  },
  tags: ['hashing', 'bloom-filter', 'probabilistic'],
  complexity: { time: 'O(k)', space: 'O(m)' },
};
