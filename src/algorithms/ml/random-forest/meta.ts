// Random Forest · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'random-forest',
  categoryId: 'ml',
  title: { zh: '随机森林', en: 'Random Forest' },
  summary: {
    zh: '随机森林属于ml类别。',
    en: 'Random Forest is a ml algorithm.',
  },
  description: {
    zh: '随机森林（Random Forest）属于ml类别的算法。',
    en: 'Random Forest is an algorithm in the ml category.',
  },
  tags: ["ml","randomized"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
