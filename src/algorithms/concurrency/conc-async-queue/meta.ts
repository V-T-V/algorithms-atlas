// 异步队列（Async Queue）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-async-queue',
  categoryId: 'concurrency',
  title: { zh: '异步队列', en: 'Async Queue' },
  summary: {
    zh: '异步队列：生产者 enqueue，消费者 await dequeue。',
    en: 'Async queue: producers enqueue, consumers await dequeue.',
  },
  description: {
    zh: '异步队列（类似 async channel）：消费者在空队列上 await；生产者 enqueue 后唤醒一个等待消费者。',
    en: 'Async queue (like an async channel): consumers await on an empty queue; producers enqueue and wake one waiting consumer.',
  },
  tags: ['concurrency', 'queue', 'async', 'producer-consumer'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
