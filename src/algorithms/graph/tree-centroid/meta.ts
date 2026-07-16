// Tree Centroid · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-centroid',
  categoryId: 'graph',
  title: { zh: '树重心', en: 'Tree Centroid' },
  summary: {
    zh: '树重心属于graph类别。',
    en: 'Tree Centroid is a graph algorithm.',
  },
  description: {
    zh: '树重心（Tree Centroid）属于graph类别的算法。',
    en: 'Tree Centroid is an algorithm in the graph category.',
  },
  tags: ["graph","tree","tree-decomposition"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
