// Centroid Decomposition · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'centroid-decomp',
  categoryId: 'graph',
  title: { zh: '点分治', en: 'Centroid Decomposition' },
  summary: {
    zh: '点分治属于graph类别。',
    en: 'Centroid Decomposition is a graph algorithm.',
  },
  description: {
    zh: '点分治（Centroid Decomposition）属于graph类别的算法。',
    en: 'Centroid Decomposition is an algorithm in the graph category.',
  },
  tags: ["graph","tree-decomposition"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
