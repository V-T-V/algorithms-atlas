// MCS 锁（MCS Lock）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-mcs-lock',
  categoryId: 'concurrency',
  title: { zh: 'MCS 锁', en: 'MCS Lock' },
  summary: { zh: '每个线程自旋本地锁节点。', en: 'Each thread spins on a local lock node.' },
  description: {
    zh: 'MCS 锁(Mellor-Crummey & Scott)在队尾插入节点，每线程只自旋自己的 locked 标志，前驱释放时通知后继，缓存友好无争用。',
    en: 'MCS lock enqueues a node per thread; each spins only on its own locked flag and the predecessor unlocks the successor on release.',
  },
  tags: ['concurrency', 'mcs-lock', 'queue-lock'],
  complexity: { time: 'O(1) per op', space: 'O(n)' },
};
