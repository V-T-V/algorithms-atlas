// Slow Path 互斥 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-slow-path',
  categoryId: 'concurrency',
  title: { zh: 'Slow Path 互斥', en: 'Slow Path Mutex' },
  summary: {
    zh: '慢路径锁：始终走队列与阻塞，确保公平，开销高于 fast path。',
    en: 'Slow-path-only lock: always enqueues and blocks, ensuring fairness at higher cost.',
  },
  description: {
    zh: '作为 Fast Path 的对照，本实现总是走「慢路径」：每次 lock 都将请求加入 FIFO 队列并阻塞等待，直到自己成为队首且锁空闲才进入。优点是 FIFO 公平、无饥饿；缺点是无竞争时也要付出队列与上下文切换开销。',
    en: 'As a contrast to Fast Path, this implementation always takes the slow path: every lock enqueues the request and blocks until it reaches the head and the lock is free. Pros: FIFO fairness, no starvation. Cons: queue and context-switch cost even when uncontended.',
  },
  tags: ['concurrency', 'mutex', 'slow-path', 'fairness'],
  complexity: { time: 'O(1) 每操作均摊', space: 'O(n)' },
};
