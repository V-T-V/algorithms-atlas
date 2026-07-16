// 条件变量模拟 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-condition-variable',
  categoryId: 'concurrency',
  title: { zh: '条件变量模拟', en: 'Condition Variable Simulation' },
  summary: {
    zh: 'wait/signal/all 模型：线程在条件不满足时挂起，被 signal 唤醒。',
    en: 'wait/signal/all: a thread blocks when the condition is false, woken by signal.',
  },
  description: {
    zh: '条件变量与互斥锁配合：wait() 原子地释放锁并阻塞，被唤醒后重新获取锁；signal() 唤醒一个等待者；broadcast/all 唤醒全部。经典用法是生产者-消费者对缓冲区非空/非满的条件等待。',
    en: 'A condition variable pairs with a mutex: wait() atomically releases the lock and blocks, reacquiring on wakeup; signal() wakes one waiter; broadcast wakes all. The canonical use is producer-consumer waiting on non-empty / non-full conditions.',
  },
  tags: ['concurrency', 'condition-variable', 'synchronization'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
