// 退避自旋锁（Backoff Spinlock）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-back-off-lock',
  categoryId: 'concurrency',
  title: { zh: '退避自旋锁', en: 'Backoff Spinlock' },
  summary: {
    zh: 'TAS + 指数退避：失败后随机延时再试，降低总线竞争。',
    en: 'TAS + exponential backoff: wait a random delay before retry to reduce bus contention.',
  },
  description: {
    zh: '退避自旋锁在 TAS 失败后，等待一段随机时间（按重试次数指数增长）再重试，避免所有线程同时争抢总线。比纯 TAS 在高竞争下更高效。',
    en: 'Backoff spinlock waits a random delay (growing exponentially with retries) after a failed TAS, avoiding simultaneous bus contention. More efficient than plain TAS under high contention.',
  },
  tags: ['concurrency', 'lock', 'spinlock', 'backoff'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
