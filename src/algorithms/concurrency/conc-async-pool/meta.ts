// 异步任务池（Async Task Pool）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-async-pool',
  categoryId: 'concurrency',
  title: { zh: '异步任务池', en: 'Async Task Pool' },
  summary: { zh: '限制并发的协程池。', en: 'Concurrency-limited coroutine pool.' },
  description: {
    zh: '异步任务池用信号量限制同时运行的任务数，超出的排队等待，常用于限制对外部资源的并发调用。',
    en: 'An async task pool uses a semaphore to cap concurrently running tasks; excess tasks queue, bounding load on external resources.',
  },
  tags: ['concurrency', 'async', 'pool', 'semaphore'],
  complexity: { time: 'O(n)', space: 'O(max)' },
};
