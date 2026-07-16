// Dijkstra 最短路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-dijkstra-3',
  categoryId: 'greedy',
  title: { zh: 'Dijkstra 最短路径', en: 'Dijkstra Shortest Path' },
  summary: {
    zh: '非负权图单源最短路径：每次扩展距离最小的未确定顶点。',
    en: 'Single-source shortest path with non-negative weights: relax via the closest unsettled vertex.',
  },
  description: {
    zh: 'Dijkstra：维护 dist[]，反复取最小距离的未确定顶点 u，松弛其所有出边。简单实现 O(V²)。',
    en: 'Dijkstra: maintain dist[]; repeatedly select the unsettled vertex with min dist and relax its edges. Simple O(V²).',
  },
  tags: ['greedy', 'graph', 'shortest-path'],
  complexity: { time: 'O(V²)', space: 'O(V)' },
};
