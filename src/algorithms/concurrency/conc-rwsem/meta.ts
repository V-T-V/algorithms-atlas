// 读写信号量（Reader-Writer Semaphore）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-rwsem',
  categoryId: 'concurrency',
  title: { zh: '读写信号量', en: 'Reader-Writer Semaphore' },
  summary: {
    zh: '读写信号量：基于信号量的读写锁，写者递归降级。',
    en: 'RW semaphore: semaphore-based rwlock; writers can downgrade.',
  },
  description: {
    zh: '读写信号量结合信号量与读写锁语义：down_read 允许并发，down_write 独占；支持写者降级为读者（downgrade_write）。',
    en: 'Reader-writer semaphore combines semaphore and rwlock semantics: down_read allows concurrency, down_write is exclusive; supports downgrade_write from writer to reader.',
  },
  tags: ['concurrency', 'synchronization', 'semaphore', 'reader-writer'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
