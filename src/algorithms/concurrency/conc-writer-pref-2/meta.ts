// 写者优先锁 v2（Writer-Preference Lock v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-writer-pref-2',
  categoryId: 'concurrency',
  title: { zh: '写者优先锁 v2', en: 'Writer-Preference Lock v2' },
  summary: {
    zh: '写者优先：有写者等待时阻止新读者，避免写者饥饿。',
    en: 'Writer preference: block new readers when a writer waits, preventing writer starvation.',
  },
  description: {
    zh: '写者优先锁：当有写者等待时，新读者被阻塞，让写者尽快获得锁，避免写者饥饿（代价是读者吞吐降低）。',
    en: 'Writer-preference lock: when a writer is waiting, new readers are blocked so the writer can proceed soon, preventing writer starvation (at the cost of reader throughput).',
  },
  tags: ['concurrency', 'lock', 'reader-writer', 'writer-priority'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
