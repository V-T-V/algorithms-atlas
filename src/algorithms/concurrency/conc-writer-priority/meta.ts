// 写者优先读写锁 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'conc-writer-priority',
  categoryId: 'concurrency',
  title: { zh: '写者优先读写锁', en: 'Writer-Priority RW Lock' },
  summary: {
    zh: '只要写者在等待，新读者必须排队，保证写者不被读者饿死。',
    en: 'New readers queue whenever a writer is waiting, preventing writer starvation.',
  },
  description: {
    zh: '写者优先：一旦有写者请求，后续到达的读者不能进入（即使当前是读态），必须等写者完成。代价是读者吞吐在写繁忙时下降。',
    en: 'Writer priority: once a writer requests, later readers cannot enter (even in read mode) until the writer finishes. The cost is reduced reader throughput under heavy write load.',
  },
  tags: ['concurrency', 'readers-writers', 'writer-priority'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
