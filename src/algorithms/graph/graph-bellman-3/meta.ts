import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-bellman-3',
  categoryId: 'graph',
  title: { zh: 'Bellman-Ford（负权 + 环检测）', en: 'Bellman-Ford (Negative Weights + Cycle)' },
  summary: {
    zh: '支持负权边的单源最短路，并能检测从源可达的负权环。',
    en: 'Single-source shortest path with negative edges; detects reachable negative cycles.',
  },
  description: {
    zh: '对所有边松弛 n-1 轮。第 n 轮若仍有更新则存在负权环。每次记录前驱可重构路径。',
    en: 'Relax all edges n-1 times; an extra pass that still updates indicates a negative cycle.',
  },
  tags: ['graph', 'shortest-path', 'bellman-ford', 'negative'],
  complexity: { time: 'O(VE)', space: 'O(V)' },
};
