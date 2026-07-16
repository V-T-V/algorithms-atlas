// LFU Cache · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lfu-cache',
  categoryId: 'ds',
  title: { zh: 'LFU缓存', en: 'LFU Cache' },
  summary: {
    zh: 'LFU缓存属于ds类别。',
    en: 'LFU Cache is a ds algorithm.',
  },
  description: {
    zh: 'LFU缓存（LFU Cache）属于ds类别的算法。',
    en: 'LFU Cache is an algorithm in the ds category.',
  },
  tags: ["ds","caching"],
  complexity: { time: 'O(1)', space: 'O(capacity)' },
};
