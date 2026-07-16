// Readers-Writers · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'readers-writers',
  categoryId: 'concurrency',
  title: { zh: '读者-写者', en: 'Readers-Writers' },
  summary: {
    zh: '读者-写者属于concurrency类别。',
    en: 'Readers-Writers is a concurrency algorithm.',
  },
  description: {
    zh: '读者-写者（Readers-Writers）属于concurrency类别的算法。',
    en: 'Readers-Writers is an algorithm in the concurrency category.',
  },
  tags: ["concurrency"],
  complexity: { time: 'O(e)', space: 'O(n)' },
};
