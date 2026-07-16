// Tree Diameter · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-diameter',
  categoryId: 'graph',
  title: { zh: '树的直径', en: 'Tree Diameter' },
  summary: {
    zh: '树的直径属于graph类别。',
    en: 'Tree Diameter is a graph algorithm.',
  },
  description: {
    zh: '树的直径（Tree Diameter）属于graph类别的算法。',
    en: 'Tree Diameter is an algorithm in the graph category.',
  },
  tags: ["graph","tree"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
