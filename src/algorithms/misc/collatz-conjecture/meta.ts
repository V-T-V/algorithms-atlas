// Collatz Conjecture · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'collatz-conjecture',
  categoryId: 'misc',
  title: { zh: '考拉兹猜想', en: 'Collatz Conjecture' },
  summary: {
    zh: '考拉兹猜想属于misc类别。',
    en: 'Collatz Conjecture is a misc algorithm.',
  },
  description: {
    zh: '考拉兹猜想（Collatz Conjecture）属于misc类别的算法。',
    en: 'Collatz Conjecture is an algorithm in the misc category.',
  },
  tags: ["misc"],
  complexity: { time: '未知（经验 O(log n)）/ unknown (empirical O(log n))', space: 'O(步数)' },
};
