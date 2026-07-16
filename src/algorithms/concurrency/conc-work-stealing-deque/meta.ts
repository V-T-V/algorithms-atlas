// 工作窃取双端队列（Work-Stealing Deque）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-work-stealing-deque',
  categoryId: 'concurrency',
  title: { zh: '工作窃取双端队列', en: 'Work-Stealing Deque' },
  summary: { zh: '本地 LIFO，窃取 FIFO。', en: 'Local LIFO, steal FIFO.' },
  description: {
    zh: '工作窃取(Java ForkJoin)每 worker 自有双端队列:本地一端 LIFO 推/弹，空闲 worker 从另一端 FIFO 窃取，平衡负载。',
    en: 'Work-stealing (Java ForkJoin) gives each worker a deque: LIFO push/pop locally, FIFO steal from the other end by idle workers.',
  },
  tags: ['concurrency', 'work-stealing', 'deque'],
  complexity: { time: 'O(1) amortized', space: 'O(n)' },
};
