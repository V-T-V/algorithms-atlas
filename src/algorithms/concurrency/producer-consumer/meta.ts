// Producer-Consumer · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'producer-consumer',
  categoryId: 'concurrency',
  title: { zh: '生产者-消费者', en: 'Producer-Consumer' },
  summary: {
    zh: '生产者-消费者属于concurrency类别。',
    en: 'Producer-Consumer is a concurrency algorithm.',
  },
  description: {
    zh: '生产者-消费者（Producer-Consumer）属于concurrency类别的算法。',
    en: 'Producer-Consumer is an algorithm in the concurrency category.',
  },
  tags: ["concurrency"],
  complexity: { time: 'O(e)', space: 'O(capacity)' },
};
