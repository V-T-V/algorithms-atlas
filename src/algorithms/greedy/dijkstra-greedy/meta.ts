// Dijkstra Shortest Path · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dijkstra-greedy',
  categoryId: 'greedy',
  title: { zh: 'Dijkstra 最短路', en: 'Dijkstra Shortest Path' },
  summary: {
    zh: 'Dijkstra 最短路属于greedy类别。',
    en: 'Dijkstra Shortest Path is a greedy algorithm.',
  },
  description: {
    zh: 'Dijkstra 最短路（Dijkstra Shortest Path）属于greedy类别的算法。',
    en: 'Dijkstra Shortest Path is an algorithm in the greedy category.',
  },
  tags: ["greedy","shortest-path"],
  complexity: { time: 'O((V+E) log V)', space: 'O(V)' },
};
