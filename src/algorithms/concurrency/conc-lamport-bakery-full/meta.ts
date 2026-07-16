// Lamport 面包店算法（完整）（Lamport Bakery (Full)）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-lamport-bakery-full',
  categoryId: 'concurrency',
  title: { zh: 'Lamport 面包店算法（完整）', en: 'Lamport Bakery (Full)' },
  summary: {
    zh: '多进程互斥，取号排队进入临界区。',
    en: 'Multi-process mutual exclusion via ticketing.',
  },
  description: {
    zh: '面包店算法(Lamport)每进程取号 choosing，按(号, pid)排序依次进临界区，无需原子操作即可实现互斥。',
    en: 'Bakery algorithm (Lamport) has each process take a ticket and enter the critical section in (number, pid) order, mutex without atomics.',
  },
  tags: ['concurrency', 'mutex', 'bakery', 'lock-free'],
  complexity: { time: 'O(n) per entry', space: 'O(n)' },
};
