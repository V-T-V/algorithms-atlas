// 时间优先锁（Time-Priority Lock）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-time-priority-lock',
  categoryId: 'concurrency',
  title: { zh: '时间优先锁', en: 'Time-Priority Lock' },
  summary: {
    zh: '按等待时间排序授予锁，等待越久越优先。',
    en: 'Grant the lock by waiting time: longer wait = higher priority.',
  },
  description: {
    zh: '时间优先锁维护每个等待线程的等待开始时间；锁释放时把锁授予等待最久的线程（FIFO/最老优先），避免饥饿。',
    en: 'Time-priority lock tracks each waiter start time; on release it grants the lock to the longest-waiting thread (oldest-first), preventing starvation.',
  },
  tags: ['concurrency', 'lock', 'fair', 'priority', 'starvation-free'],
  complexity: { time: 'O(log n) per op', space: 'O(n)' },
};
