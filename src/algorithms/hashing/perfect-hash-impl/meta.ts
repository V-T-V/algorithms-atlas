// 完美哈希（CHD 简化）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'perfect-hash-impl',
  categoryId: 'hashing',
  title: { zh: '完美哈希（CHD 简化）', en: 'Perfect Hash (Simplified CHD)' },
  summary: {
    zh: '为固定键集构造无冲突哈希：一级分桶、桶内二级重哈希至零碰撞。',
    en: 'Build a collision-free hash for a fixed key set: first-level bucketing, second-level rehash per bucket to zero collisions.',
  },
  description: {
    zh: '完美哈希（perfect hashing）针对一个「固定且已知」的键集合，构造一个哈希函数，使得每个键映射到唯一槽位、查询时间为 O(1) 且无冲突。Fredman-Komlós-Szemerédi（FKS）经典方案采用两级结构：第一级用一个哈希函数 h1 把 n 个键分到 m≈n 个桶里；对每个桶 b（含 k_b 个键），分配一块大小约 k_b² 的二级表，并用一个独立参数重哈希直到该桶内无冲突。期望总空间为 O(n)。本实现是其简化版（类似 CHD 的思路）：一级分桶后，对每个桶穷举二级参数 g，使得桶内键经 h1(key)+g 二次哈希后两两不同，最终落在全局无冲突的槽位数组中。构造后查询仅需两次哈希。适用于只读字典、编译器关键字表、IP 黑名单等键集固定的场景。',
    en: 'Perfect hashing, for a fixed and known key set, constructs a hash function mapping each key to a unique slot with O(1) lookup and no collisions. The Fredman-Komlós-Szemerédi (FKS) scheme uses two levels: the first hash h1 distributes n keys into m≈n buckets; each bucket b (with k_b keys) is assigned a second-level table of size about k_b² and an independent parameter is rehashed until the bucket is collision-free. Expected total space is O(n). This implementation is a simplified variant (CHD-like): after first-level bucketing, each bucket tries second-level parameters g so that keys hashed by h1(key)+g become pairwise distinct, landing in a global collision-free slot array. After construction, a lookup needs only two hashes. It suits read-only dictionaries, compiler keyword tables, IP blocklists, and other fixed key-set scenarios.',
  },
  tags: ['hashing', 'perfect-hash', 'static', 'collision-free'],
  complexity: { time: 'O(n) 期望构造', space: 'O(n)' },
};
