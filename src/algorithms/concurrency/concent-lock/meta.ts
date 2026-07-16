// CLH 队列锁（CLH Queue Lock）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'concent-lock',
  categoryId: 'concurrency',
  title: { zh: 'CLH 队列锁', en: 'CLH Queue Lock' },
  summary: {
    zh: 'CLH：线程在隐式队列前驱节点上自旋，FIFO 公平。',
    en: 'CLH: each thread spins on its predecessor node in an implicit FIFO queue.',
  },
  description: {
    zh: 'CLH 锁（Craig, Magnussen, Landin, Hagersten）：每个获取锁的线程创建一个新节点排在队尾，在前驱节点的状态字段上自旋。释放时把自己的节点置为 false。FIFO 公平且只需局部缓存。',
    en: 'CLH lock: each acquiring thread appends a node to the queue tail and spins on its predecessor state field; release sets its own node false. FIFO-fair with only local caching.',
  },
  tags: ['concurrency', 'lock', 'queue', 'clh', 'fair'],
  complexity: { time: 'O(1) per acquire', space: 'O(n)' },
};
