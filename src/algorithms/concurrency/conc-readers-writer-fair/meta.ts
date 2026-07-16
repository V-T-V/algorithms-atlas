// 公平读写锁 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-readers-writer-fair',
  categoryId: 'concurrency',
  title: { zh: '公平读写锁', en: 'Fair Readers-Writer Lock' },
  summary: {
    zh: '读者可并发、写者独占；用单锁串行化，避免读者或写者饥饿。',
    en: 'Readers share, writers exclude; serialized so neither starves.',
  },
  description: {
    zh: '公平读写锁保证请求按到达顺序授予：后到读者不能插队抢先于已等待的写者。状态机：多个 reader 可同时持有；writer 独占；请求若有冲突则排队。',
    en: 'A fair readers-writer lock grants requests in arrival order: late readers cannot jump ahead of a waiting writer. State machine: multiple readers may hold simultaneously; a writer is exclusive; conflicting requests queue.',
  },
  tags: ['concurrency', 'readers-writers', 'fair-lock'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
