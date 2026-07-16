// Bloom Filter · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bloom-filter-table',
  categoryId: 'hashing',
  title: { zh: '布隆过滤器', en: 'Bloom Filter' },
  summary: {
    zh: 'k 个哈希函数驱动的位数组：插入置位，查询全 1 才可能存在。',
    en: 'A bit array driven by k hash functions: set bits on insert; a query needs all bits set to possibly exist.',
  },
  description: {
    zh: '布隆过滤器（Bloom Filter）是空间高效的概率型集合。底层是 m 位的位数组与 k 个独立哈希函数。插入元素时，把 k 个哈希位置 1；查询时，若任一对应位为 0 则元素一定不在集合中（无假阴性），若全部为 1 则元素「可能在」集合中（有假阳性）。假阳性率约为 (1 - e^(-kn/m))^k，随 m 增大、k 选取最优而下降。',
    en: 'A Bloom filter is a space-efficient probabilistic set. It uses an m-bit array and k independent hash functions. On insert, it sets the k hashed bits to 1; on query, if any corresponding bit is 0 the element is definitely not in the set (no false negatives), while if all are 1 the element "may be" in the set (possible false positives). The false positive rate is approximately (1 - e^(-kn/m))^k, decreasing as m grows and k is chosen optimally.',
  },
  tags: ['hashing', 'probabilistic', 'set', 'filter'],
  complexity: { time: 'O(k)', space: 'O(m) 位' },
};
