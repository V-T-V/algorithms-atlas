// CLH 队列锁（CLH Lock）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-clh-lock',
  categoryId: 'concurrency',
  title: { zh: 'CLH 队列锁', en: 'CLH Lock' },
  summary: { zh: '隐式链表队列自旋锁。', en: 'Implicit linked-list queue spinlock.' },
  description: {
    zh: 'CLH 锁(Craig/Landin/Hagersten)每线程持有指向上一节点的引用，自旋前驱的 locked 字段，释放时把自己节点 unlocked。',
    en: 'CLH lock has each thread spin on the predecessor node locked flag; release clears its own node.',
  },
  tags: ['concurrency', 'clh-lock', 'queue-lock'],
  complexity: { time: 'O(1) per op', space: 'O(n)' },
};
