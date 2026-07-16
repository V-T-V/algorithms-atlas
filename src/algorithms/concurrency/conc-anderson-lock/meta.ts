// Anderson 锁（Anderson Lock）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-anderson-lock',
  categoryId: 'concurrency',
  title: { zh: 'Anderson 锁', en: 'Anderson Lock' },
  summary: {
    zh: '基于槽（slot）数组的公平自旋锁：每个线程等自己的槽。',
    en: 'Fair array-based spinlock: each thread spins on its own slot.',
  },
  description: {
    zh: 'Anderson 锁（Anderson 1990）用一个大小为 n 的 slots 数组实现 FIFO 公平：获得锁的线程释放时把下一个 slot 置为 true，下一个线程在自己的 slot 上自旋。减少缓存争用。',
    en: 'Anderson lock (Anderson 1990) uses an array of n slots for FIFO fairness: the holder, on release, sets the next slot true; the next thread spins on its own slot, reducing cache contention.',
  },
  tags: ['concurrency', 'lock', 'spinlock', 'fair', 'anderson'],
  complexity: { time: 'O(1) per acquire', space: 'O(n)' },
};
