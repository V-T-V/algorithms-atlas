// Dijkstra · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dijkstra',
  categoryId: 'graph',
  title: { zh: 'Dijkstra 最短路径', en: 'Dijkstra' },
  summary: {
    zh: 'Dijkstra 最短路径属于graph类别。',
    en: 'Dijkstra is a graph algorithm.',
  },
  description: {
    zh: 'Dijkstra 最短路径（Dijkstra）属于graph类别的算法。',
    en: 'Dijkstra is an algorithm in the graph category.',
  },
  tags: ["graph","shortest-path"],
  complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
};
