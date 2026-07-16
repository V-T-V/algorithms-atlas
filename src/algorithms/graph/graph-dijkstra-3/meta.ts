import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-dijkstra-3',
  categoryId: 'graph',
  title: { zh: 'Dijkstra（优先队列 + 前驱记录）', en: 'Dijkstra with Predecessor Tracking' },
  summary: {
    zh: '二叉堆优化的单源最短路，并记录前驱以重构最短路径。',
    en: 'Binary-heap Dijkstra single-source shortest path, tracking predecessors for path reconstruction.',
  },
  description: {
    zh: '维护 dist[] 与前驱 prev[]。每次从堆中取出最小 dist 节点 u，松弛其邻居：若 dist[u]+w<dist[v] 则更新并记录 prev[v]=u。',
    en: 'Maintain dist[] and prev[]. Pop min-dist node u from heap; relax neighbors; on improvement set prev[v]=u.',
  },
  tags: ['graph', 'shortest-path', 'dijkstra', 'heap'],
  complexity: { time: 'O((V+E) log V)', space: 'O(V)' },
};
