// Topological Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'topological-sort',
  categoryId: 'graph',
  title: { zh: '拓扑排序', en: 'Topological Sort' },
  summary: {
    zh: '拓扑排序属于graph类别。',
    en: 'Topological Sort is a graph algorithm.',
  },
  description: {
    zh: '拓扑排序（Topological Sort）属于graph类别的算法。',
    en: 'Topological Sort is an algorithm in the graph category.',
  },
  tags: ["graph","sorting","topological-sort"],
  complexity: { time: 'O(?)', space: 'O(?)' },
};
