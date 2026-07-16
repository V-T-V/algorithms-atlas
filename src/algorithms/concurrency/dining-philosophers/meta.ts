// Dining Philosophers · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dining-philosophers',
  categoryId: 'concurrency',
  title: { zh: '哲学家就餐', en: 'Dining Philosophers' },
  summary: {
    zh: '哲学家就餐属于concurrency类别。',
    en: 'Dining Philosophers is a concurrency algorithm.',
  },
  description: {
    zh: '哲学家就餐（Dining Philosophers）属于concurrency类别的算法。',
    en: 'Dining Philosophers is an algorithm in the concurrency category.',
  },
  tags: ["concurrency"],
  complexity: { time: 'O(n·meals)', space: 'O(n)' },
};
