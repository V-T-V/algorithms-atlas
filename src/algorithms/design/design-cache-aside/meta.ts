// Cache-Aside（Cache-Aside）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'design-cache-aside',
  categoryId: 'design',
  title: { zh: 'Cache-Aside', en: 'Cache-Aside' },
  summary: {
    zh: 'Cache-Aside：读时回填缓存，写时失效。',
    en: 'Cache-aside: lazy-fill cache on read; invalidate on write.',
  },
  description: {
    zh: 'Cache-Aside（旁路缓存）：读时先查缓存，未命中查 DB 并回填；写时更新 DB 并使缓存失效。最常用缓存策略。',
    en: 'Cache-Aside: on read, check cache first; on miss, query DB and fill cache; on write, update DB and invalidate cache. The most common caching strategy.',
  },
  tags: ['design', 'cache', 'cache-aside', 'lazy-fill'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
