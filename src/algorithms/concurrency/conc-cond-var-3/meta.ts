// 条件变量 v3（Condition Variable v3）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-cond-var-3',
  categoryId: 'concurrency',
  title: { zh: '条件变量 v3', en: 'Condition Variable v3' },
  summary: {
    zh: 'wait/signal：线程在条件变量上挂起，被 signal 唤醒。',
    en: 'wait/signal: threads suspend on a condition variable and resume on signal.',
  },
  description: {
    zh: '条件变量允许线程原子地释放锁并挂起（wait），其他线程满足条件后通过 signal/broadcast 唤醒。本实现模拟生产者-消费者。',
    en: 'A condition variable lets a thread atomically release the lock and suspend (wait); other threads signal/broadcast when the condition holds. Demo: producer-consumer.',
  },
  tags: ['concurrency', 'synchronization', 'condition-variable', 'monitor'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
