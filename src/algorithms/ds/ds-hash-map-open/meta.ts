// 开放寻址哈希表（线性探测）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-hash-map-open',
  categoryId: 'ds',
  title: { zh: '开放寻址哈希表（线性探测）', en: 'Open Addressing Hash Map (Linear Probing)' },
  summary: {
    zh: '用数组 + 线性探测解决冲突的哈希表，支持 put/get/delete。',
    en: 'Array-based hash table using linear probing for collisions; supports put/get/delete.',
  },
  description: {
    zh: '开放寻址哈希表把所有条目放在单个数组中，遇到冲突时按线性探测（i+1, i+2, ...）寻找下一个空槽。本实现支持动态扩容（负载因子超 0.7 时翻倍）、墓碑标记（TOMBSTONE）以正确删除。期望 O(1) 操作。区别于已有的 hash-map（链地址法）。零 DOM 依赖。',
    en: 'Open addressing places all entries in one array; on collision it probes linearly (i+1, i+2, ...) for the next empty slot. This supports dynamic resizing (doubles at load factor 0.7) and tombstone markers for correct deletion. Expected O(1) per op. Distinct from the existing hash-map (chaining). Zero DOM dependency.',
  },
  tags: ['ds', 'hash-table', 'open-addressing', 'linear-probing'],
  complexity: { time: 'O(1) expected', space: 'O(n)' },
};
