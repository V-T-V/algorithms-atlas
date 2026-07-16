// K-Means Clustering · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kmeans',
  categoryId: 'ml',
  title: { zh: 'K-均值聚类', en: 'K-Means Clustering' },
  summary: {
    zh: 'K-均值聚类属于ml类别。',
    en: 'K-Means Clustering is a ml algorithm.',
  },
  description: {
    zh: 'K-均值聚类（K-Means Clustering）属于ml类别的算法。',
    en: 'K-Means Clustering is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n·k·d·T)', space: 'O(n·k)' },
};
