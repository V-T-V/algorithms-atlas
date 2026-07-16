// Depth-First Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dfs',
  categoryId: 'graph',
  title: { zh: '深度优先搜索', en: 'Depth-First Search' },
  summary: {
    zh: '深度优先搜索属于graph类别。',
    en: 'Depth-First Search is a graph algorithm.',
  },
  description: {
    zh: '深度优先搜索（Depth-First Search）属于graph类别的算法。',
    en: 'Depth-First Search is an algorithm in the graph category.',
  },
  tags: ["graph","dfs","traversal"],
  complexity: { time: 'O(V + E)', space: 'O(V)' },
};
