// Dijkstra最短路 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-dijkstra',
  categoryId: 'network',
  title: { zh: 'Dijkstra最短路', en: 'Dijkstra Shortest Path' },
  summary: {
    zh: '非负权重图单源最短路。',
    en: 'Single-source shortest path on a non-negative weighted graph.',
  },
  description: {
    zh: '贪心：每次取最小距离节点松弛邻居。',
    en: 'Greedy relax via min-heap simulation. O((V+E) log V).',
  },
  tags: ['network', 'graph', 'shortest-path'],
  complexity: { time: 'O((V+E) log V)', space: 'O(V)' },
};
