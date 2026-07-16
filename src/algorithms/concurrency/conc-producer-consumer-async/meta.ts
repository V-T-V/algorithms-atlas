// 异步生产消费 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-producer-consumer-async',
  categoryId: 'concurrency',
  title: { zh: '异步生产消费', en: 'Async Producer-Consumer' },
  summary: {
    zh: '用 Promise 队列模拟异步生产-消费：生产 resolve、消费 await。',
    en: 'Promise-queue model of async producer-consumer: producers resolve, consumers await.',
  },
  description: {
    zh: '异步生产-消费用有界队列协调：生产者入队，队列满时等待；消费者出队，队列空时等待。事件序列模拟把 produce/consume 按时序推进，展示队列长度变化与阻塞。',
    en: 'Async producer-consumer uses a bounded queue: producers enqueue and wait when full; consumers dequeue and wait when empty. The event-sequence simulation drives produce/consume over time, showing queue length changes and blocking.',
  },
  tags: ['concurrency', 'producer-consumer', 'async', 'bounded-buffer'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
