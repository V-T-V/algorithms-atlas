// 屏障 v2（Barrier v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-barrier-2',
  categoryId: 'concurrency',
  title: { zh: '屏障 v2', en: 'Barrier v2' },
  summary: {
    zh: '阶段屏障：所有线程到达后统一放行（事件序列版）。',
    en: 'Phase barrier: release all threads once they arrive (event-sequence variant).',
  },
  description: {
    zh: '屏障 v2 与 cyclic barrier 类似但用更直接的事件序列：n 个线程依次到达，第 n 个到达时触发放行并重置。',
    en: 'Barrier v2 is similar to a cyclic barrier but uses a more direct event sequence: n threads arrive in turn; the n-th arrival triggers release and reset.',
  },
  tags: ['concurrency', 'synchronization', 'barrier'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
