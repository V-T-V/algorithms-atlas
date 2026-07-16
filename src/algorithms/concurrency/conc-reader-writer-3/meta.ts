// 读写锁 v3（Reader-Writer Lock v3）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-reader-writer-3',
  categoryId: 'concurrency',
  title: { zh: '读写锁 v3', en: 'Reader-Writer Lock v3' },
  summary: {
    zh: '区分读/写：多读并发，写独占。',
    en: 'Distinguish read/write: multiple readers concurrent, writers exclusive.',
  },
  description: {
    zh: '读写锁允许多个读者同时持有，但写者独占。本实现维护 activeReaders 计数与 writer 等待标志；读者过多时可能延迟写者。',
    en: 'Reader-writer lock allows multiple concurrent readers but exclusive writers. This impl tracks activeReaders and a writer-waiting flag; many readers can delay writers.',
  },
  tags: ['concurrency', 'lock', 'reader-writer', 'shared'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
