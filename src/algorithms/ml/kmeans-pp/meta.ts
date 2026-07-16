// K-Means++ · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kmeans-pp',
  categoryId: 'ml',
  title: { zh: 'K-Means++', en: 'K-Means++' },
  summary: {
    zh: 'K-Means++属于ml类别。',
    en: 'K-Means++ is a ml algorithm.',
  },
  description: {
    zh: 'K-Means++（K-Means++）属于ml类别的算法。',
    en: 'K-Means++ is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
