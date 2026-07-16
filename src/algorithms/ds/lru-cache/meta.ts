// LRU Cache · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lru-cache',
  categoryId: 'ds',
  title: { zh: 'LRU缓存', en: 'LRU Cache' },
  summary: {
    zh: 'LRU缓存属于ds类别。',
    en: 'LRU Cache is a ds algorithm.',
  },
  description: {
    zh: 'LRU缓存（LRU Cache）属于ds类别的算法。',
    en: 'LRU Cache is an algorithm in the ds category.',
  },
  tags: ["ds","caching"],
  complexity: { time: 'O(1)', space: 'O(capacity)' },
};
