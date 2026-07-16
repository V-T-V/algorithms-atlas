// MPSC 无锁队列（MPSC Lock-Free Queue）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-mpsc-queue',
  categoryId: 'concurrency',
  title: { zh: 'MPSC 无锁队列', en: 'MPSC Lock-Free Queue' },
  summary: {
    zh: '多生产者单消费者无锁队列。',
    en: 'Many-producer single-consumer lock-free queue.',
  },
  description: {
    zh: 'MPSC 队列(Vyukov)生产者用 CAS 把节点原子挂到队尾，单一消费者从队头取出，无锁且无争用于消费者。',
    en: 'MPSC queue (Vyukov) has producers CAS-append nodes to the tail; a single consumer dequeues from the head, lock-free.',
  },
  tags: ['concurrency', 'mpsc', 'lock-free', 'queue'],
  complexity: { time: 'O(1) amortized', space: 'O(n)' },
};
