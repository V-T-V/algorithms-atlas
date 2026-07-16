// 处理器亲和性调度 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-processor-affinity',
  categoryId: 'scheduling',
  title: { zh: '处理器亲和性调度', en: 'Processor Affinity Scheduling' },
  summary: {
    zh: '线程倾向在原核运行以利用缓存，迁移仅在失衡时发生。',
    en: 'Threads prefer their home core for cache locality; migration only on imbalance.',
  },
  description: {
    zh: '软亲和性：调度器优先把线程放回上次运行的核（保持缓存热），仅当某核队列显著超载时才迁移。降低缓存失效开销。',
    en: 'Soft affinity: the scheduler returns a thread to its previous core (keeping caches warm) and migrates only when a core is significantly overloaded. Reduces cache-miss overhead.',
  },
  tags: ['scheduling', 'affinity', 'multicore', 'cache'],
  complexity: { time: 'O(n)', space: 'O(p)' },
};
