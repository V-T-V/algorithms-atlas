// Hierarchical Cluster · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hierarchical',
  categoryId: 'ml',
  title: { zh: '层次聚类', en: 'Hierarchical Cluster' },
  summary: {
    zh: '层次聚类属于ml类别。',
    en: 'Hierarchical Cluster is a ml algorithm.',
  },
  description: {
    zh: '层次聚类（Hierarchical Cluster）属于ml类别的算法。',
    en: 'Hierarchical Cluster is an algorithm in the ml category.',
  },
  tags: ["ml"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
