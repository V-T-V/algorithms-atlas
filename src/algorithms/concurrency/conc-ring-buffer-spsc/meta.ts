// SPSC 环形缓冲（SPSC Ring Buffer）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-ring-buffer-spsc',
  categoryId: 'concurrency',
  title: { zh: 'SPSC 环形缓冲', en: 'SPSC Ring Buffer' },
  summary: {
    zh: '单生产者单消费者无锁环形缓冲（经典 Damon FIFO）。',
    en: 'Single-producer single-consumer lockless ring buffer (classic Damon FIFO).',
  },
  description: {
    zh: 'SPSC 环形缓冲：生产者独占 head，消费者独占 tail，通过 volatile 读取对方索引实现无锁通信。无竞争、无等待（wait-free）。',
    en: 'SPSC ring buffer: the producer owns head, the consumer owns tail; each reads the other index through volatile reads for lockless communication. Contention-free and wait-free.',
  },
  tags: ['concurrency', 'queue', 'ring-buffer', 'spsc', 'lockless', 'wait-free'],
  complexity: { time: 'O(1)', space: 'O(capacity)' },
};
