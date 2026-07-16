// DBSCAN · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dbscan',
  categoryId: 'ml',
  title: { zh: 'DBSCAN聚类', en: 'DBSCAN' },
  summary: {
    zh: 'DBSCAN聚类属于ml类别。',
    en: 'DBSCAN is a ml algorithm.',
  },
  description: {
    zh: 'DBSCAN聚类（DBSCAN）属于ml类别的算法。',
    en: 'DBSCAN is an algorithm in the ml category.',
  },
  tags: ["ml"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
