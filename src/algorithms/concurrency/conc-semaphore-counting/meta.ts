// 计数信号量（Counting Semaphore）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-semaphore-counting',
  categoryId: 'concurrency',
  title: { zh: '计数信号量', en: 'Counting Semaphore' },
  summary: {
    zh: '计数信号量：允许 N 个线程同时进入临界区。',
    en: 'Counting semaphore: allow up to N threads into the critical section.',
  },
  description: {
    zh: 'Dijkstra 信号量：wait 使 count−1（< 0 阻塞），signal 使 count+1（唤醒等待者）。计数信号量 count 初值 > 1，允许多个线程同时持有。常用于资源池。',
    en: 'Dijkstra semaphore: wait decrements count (blocks if < 0), signal increments (wakes a waiter). A counting semaphore starts with count > 1, allowing multiple holders. Used for resource pools.',
  },
  tags: ['concurrency', 'synchronization', 'semaphore', 'counting'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
