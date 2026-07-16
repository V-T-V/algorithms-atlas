// Bakery 算法 v2（Bakery Algorithm v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-bakery-2',
  categoryId: 'concurrency',
  title: { zh: 'Bakery 算法 v2', en: 'Bakery Algorithm v2' },
  summary: {
    zh: 'Lamport Bakery：取号排序，号小者优先进入临界区。',
    en: 'Lamport Bakery: take a ticket; the smallest ticket enters first.',
  },
  description: {
    zh: 'Bakery 算法（Lamport 1974）模拟面包店取号：每个线程进入前取一个比所有现有号大 1 的号；号最小者（线程 id 小者破并列）进入临界区。无原子读写的互斥算法。',
    en: 'Bakery algorithm (Lamport 1974) mimics a bakery ticket: each thread takes a ticket one larger than all current tickets; the smallest ticket (ties broken by thread id) enters the critical section. Mutual exclusion without atomic read-modify-write.',
  },
  tags: ['concurrency', 'lock', 'bakery', 'mutual-exclusion', 'lamport'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
