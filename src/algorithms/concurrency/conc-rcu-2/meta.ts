// RCU v2（Read-Copy-Update v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-rcu-2',
  categoryId: 'concurrency',
  title: { zh: 'RCU v2', en: 'Read-Copy-Update v2' },
  summary: {
    zh: 'RCU：读者无锁；写者复制-更新，宽限期后回收旧版本。',
    en: 'RCU: readers are lockless; writers copy-update, reclaim old version after a grace period.',
  },
  description: {
    zh: 'RCU（Read-Copy-Update）用于读多写少的数据结构：读者不持锁；写者复制一份做修改并用原子指针替换；所有读者退出「宽限期」后才回收旧版本。',
    en: 'RCU (Read-Copy-Update) suits read-mostly structures: readers take no locks; writers copy-modify and swap the pointer atomically; the old version is reclaimed only after a grace period (all pre-existing readers done).',
  },
  tags: ['concurrency', 'synchronization', 'rcu', 'lockless', 'reader-heavy'],
  complexity: { time: 'O(1) read', space: 'O(n)' },
};
