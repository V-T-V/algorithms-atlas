// K-Nearest Neighbors · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'knn',
  categoryId: 'ml',
  title: { zh: 'K近邻', en: 'K-Nearest Neighbors' },
  summary: {
    zh: 'K近邻属于ml类别。',
    en: 'K-Nearest Neighbors is a ml algorithm.',
  },
  description: {
    zh: 'K近邻（K-Nearest Neighbors）属于ml类别的算法。',
    en: 'K-Nearest Neighbors is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
