// Semaphore · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'semaphore',
  categoryId: 'concurrency',
  title: { zh: '信号量', en: 'Semaphore' },
  summary: {
    zh: '计数信号量：内部计数 + 等待队列，控制有限资源的并发访问。',
    en: 'Counting semaphore: internal counter + wait queue to govern access to bounded resources.',
  },
  description: {
    zh: '信号量（Semaphore, Dijkstra PV 操作）用一个整型计数 `value` 与一个等待队列协调并发。\n\n- `acquire(P)`：若 `value > 0` 则 `value--` 立即进入；否则线程阻塞，加入等待队列。\n- `release(V)`：`value++`；若等待队列非空则唤醒一个线程并立刻让它获得一个许可（计数净不变）。\n\n计数信号量可表达「N 个许可」的资源池；二值信号量（初始为 1）则退化成互斥锁。本实现以「事件序列」确定性模拟 acquire/release，不真起线程，便于录制与测试。',
    en: 'A semaphore (Dijkstra P/V) coordinates concurrency with an integer counter `value` and a wait queue.\n\n- `acquire(P)`: if `value > 0`, decrement and proceed; otherwise the thread blocks and joins the queue.\n- `release(V)`: increment `value`; if the queue is non-empty, wake one waiter and hand off the permit immediately (net count unchanged).\n\nA counting semaphore models a pool of N permits; a binary semaphore (init = 1) degenerates into a mutex. This implementation deterministically simulates acquire/release as an event sequence without real threads, for easy recording and testing.',
  },
  tags: ['concurrency', 'synchronization', 'semaphore'],
  complexity: { time: 'O(m)', space: 'O(m)' },
  attributes: { model: '事件序列模拟 / event-sequence simulation' },
};
