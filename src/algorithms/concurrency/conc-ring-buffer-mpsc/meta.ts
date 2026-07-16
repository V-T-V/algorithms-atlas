// MPSC 环形缓冲（MPSC Ring Buffer）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-ring-buffer-mpsc',
  categoryId: 'concurrency',
  title: { zh: 'MPSC 环形缓冲', en: 'MPSC Ring Buffer' },
  summary: {
    zh: '多生产者单消费者环形缓冲：无锁入队，单消费者出队。',
    en: 'Multi-producer single-consumer ring buffer: lockless enqueue, single consumer dequeue.',
  },
  description: {
    zh: 'MPSC 环形缓冲：多生产者用 CAS 推进 head 入队；单消费者独占 tail 出队。无锁、低延迟，常见于内核消息传递。',
    en: 'MPSC ring buffer: multiple producers use CAS to advance head for enqueue; a single consumer owns the tail for dequeue. Lockless, low-latency; common in kernel messaging.',
  },
  tags: ['concurrency', 'queue', 'ring-buffer', 'mpsc', 'lockless'],
  complexity: { time: 'O(1)', space: 'O(capacity)' },
};
