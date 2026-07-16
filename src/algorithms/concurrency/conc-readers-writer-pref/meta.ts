// 写优先读写锁（Writer-Preference RW Lock）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-readers-writer-pref',
  categoryId: 'concurrency',
  title: { zh: '写优先读写锁', en: 'Writer-Preference RW Lock' },
  summary: { zh: '有写者等待时阻塞新读者。', en: 'New readers block when a writer waits.' },
  description: {
    zh: '写优先读写锁在有写者等待时拒绝新读者进入，避免写者饥饿，常用于更新频繁的场景。',
    en: 'Writer-preference RW lock blocks new readers while a writer is waiting, avoiding writer starvation.',
  },
  tags: ['concurrency', 'rw-lock', 'writer-preference'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
