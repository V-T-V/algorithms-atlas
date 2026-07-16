// Floyd-Warshall · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'floyd-warshall',
  categoryId: 'graph',
  title: { zh: 'Floyd-Warshall 全源最短路', en: 'Floyd-Warshall' },
  summary: {
    zh: 'Floyd-Warshall 全源最短路属于graph类别。',
    en: 'Floyd-Warshall is a graph algorithm.',
  },
  description: {
    zh: 'Floyd-Warshall 全源最短路（Floyd-Warshall）属于graph类别的算法。',
    en: 'Floyd-Warshall is an algorithm in the graph category.',
  },
  tags: ["graph","shortest-path","cryptography"],
  complexity: { time: 'O(V³)', space: 'O(V²)' },
};
