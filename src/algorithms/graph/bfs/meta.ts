// Breadth-First Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bfs',
  categoryId: 'graph',
  title: { zh: '广度优先搜索', en: 'Breadth-First Search' },
  summary: {
    zh: '广度优先搜索属于graph类别。',
    en: 'Breadth-First Search is a graph algorithm.',
  },
  description: {
    zh: '广度优先搜索（Breadth-First Search）属于graph类别的算法。',
    en: 'Breadth-First Search is an algorithm in the graph category.',
  },
  tags: ["graph","bfs","traversal"],
  complexity: { time: 'O(V + E)', space: 'O(V)' },
};
