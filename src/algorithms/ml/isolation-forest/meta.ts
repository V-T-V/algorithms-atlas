// Isolation Forest · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'isolation-forest',
  categoryId: 'ml',
  title: { zh: '孤立森林', en: 'Isolation Forest' },
  summary: {
    zh: '孤立森林属于ml类别。',
    en: 'Isolation Forest is a ml algorithm.',
  },
  description: {
    zh: '孤立森林（Isolation Forest）属于ml类别的算法。',
    en: 'Isolation Forest is an algorithm in the ml category.',
  },
  tags: ["ml"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
