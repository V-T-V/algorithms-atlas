// Bellman-Ford · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bellman-ford',
  categoryId: 'graph',
  title: { zh: 'Bellman-Ford 最短路', en: 'Bellman-Ford' },
  summary: {
    zh: 'Bellman-Ford 最短路属于graph类别。',
    en: 'Bellman-Ford is a graph algorithm.',
  },
  description: {
    zh: 'Bellman-Ford 最短路（Bellman-Ford）属于graph类别的算法。',
    en: 'Bellman-Ford is an algorithm in the graph category.',
  },
  tags: ["graph","shortest-path","network-flow"],
  complexity: { time: 'O(V·E)', space: 'O(V)' },
};
