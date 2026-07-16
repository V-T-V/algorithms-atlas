// 慢路径锁 v2（Slow Path Lock v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-slow-lock-2',
  categoryId: 'concurrency',
  title: { zh: '慢路径锁 v2', en: 'Slow Path Lock v2' },
  summary: {
    zh: '总是排队（无快路径）的公平锁，作为 Fast Lock 的对照组。',
    en: 'Always-queued fair lock (no fast path); a baseline contrast to Fast Lock.',
  },
  description: {
    zh: '慢路径锁始终使用基于队列的获取/释放路径，便于与 Fast Lock 对比延迟。FIFO 公平，但即使无竞争也要付出队列维护开销。',
    en: 'The slow-path lock always uses the queued acquire/release path, providing a baseline to contrast with Fast Lock latency. FIFO-fair but pays queue overhead even when uncontended.',
  },
  tags: ['concurrency', 'lock', 'queue', 'fair', 'baseline'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
