// 快速锁 v2（Fast Lock v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-fast-lock-2',
  categoryId: 'concurrency',
  title: { zh: '快速锁 v2', en: 'Fast Lock v2' },
  summary: {
    zh: 'Fast Lock：无竞争路径仅 1 条原子指令，回退到慢路径。',
    en: 'Fast Lock: uncontended fast path uses 1 atomic op, falls back to slow path.',
  },
  description: {
    zh: 'Fast Lock（Mellor-Crummey & Scott）针对常见无竞争情形优化：快路径一次 CAS 即获锁；失败则进入基于队列的慢路径。低竞争下接近零开销。',
    en: 'Fast Lock (Mellor-Crummey & Scott) optimizes the common uncontended case: the fast path acquires with a single CAS; on failure it falls back to a queue-based slow path. Near-zero overhead under low contention.',
  },
  tags: ['concurrency', 'lock', 'fast-path', 'cas'],
  complexity: { time: 'O(1) fast / O(n) slow', space: 'O(n)' },
};
