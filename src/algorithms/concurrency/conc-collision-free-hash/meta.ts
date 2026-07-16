// 无锁哈希表（分段）（Lock-Free Striped Hash Table）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-collision-free-hash',
  categoryId: 'concurrency',
  title: { zh: '无锁哈希表（分段）', en: 'Lock-Free Striped Hash Table' },
  summary: { zh: '分段锁哈希表减少争用。', en: 'Striped locks reduce hash-table contention.' },
  description: {
    zh: '分段哈希表把桶分成若干段(stripes)，每段一把锁，不同段的操作并发进行，是 Java ConcurrentHashMap 的经典设计。',
    en: 'A striped hash table partitions buckets into segments each with its own lock; different segments operate concurrently (Java ConcurrentHashMap).',
  },
  tags: ['concurrency', 'hash-table', 'lock-striping'],
  complexity: { time: 'O(1) avg', space: 'O(n)' },
};
