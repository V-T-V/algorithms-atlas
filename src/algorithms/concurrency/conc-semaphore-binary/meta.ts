// 二值信号量（Binary Semaphore）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-semaphore-binary',
  categoryId: 'concurrency',
  title: { zh: '二值信号量', en: 'Binary Semaphore' },
  summary: {
    zh: '二值信号量（0/1）：等价于互斥锁。',
    en: 'Binary semaphore (0/1): equivalent to a mutex.',
  },
  description: {
    zh: '二值信号量 count 只能取 0 或 1，功能上等价于互斥锁，但通常可在不同线程间 signal（不要求获取者释放）。',
    en: 'A binary semaphore takes only values 0 or 1, functionally equivalent to a mutex, but typically can be signaled by a different thread than the acquirer.',
  },
  tags: ['concurrency', 'synchronization', 'semaphore', 'binary', 'mutex'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
