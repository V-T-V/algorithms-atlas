// 共享/排他（SX）锁（Shared/Exclusive Lock）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-sx-lock',
  categoryId: 'concurrency',
  title: { zh: '共享/排他（SX）锁', en: 'Shared/Exclusive Lock' },
  summary: { zh: '读写锁允许多读单写。', en: 'Read-write lock: many readers, one writer.' },
  description: {
    zh: 'SX 读写锁允许多个读者并发持有共享锁，写者持有排他锁时排斥所有其它读写，用计数器实现优先级策略。',
    en: 'Shared/Exclusive lock allows concurrent shared (read) holders; an exclusive (write) holder blocks all others.',
  },
  tags: ['concurrency', 'rw-lock', 'read-write'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
