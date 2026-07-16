import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'edge-biconnected',
  categoryId: 'graph',
  title: { zh: '边双连通分量', en: 'Edge-Biconnected Component' },
  summary: {
    zh: 'DFS 找桥，删桥后的连通块即边双连通分量。',
    en: 'Find bridges via DFS; components after removing bridges are edge-biconnected.',
  },
  description: {
    zh: '边双连通分量是去掉任意一条边仍连通的极大子图。无向边 (u,v) 是桥，当且仅当 low[v] > dfn[u]（删去它会让图不连通）。算法先 DFS 求出所有桥，再删去桥后对剩余图做连通块划分，每个块就是一个边双连通分量。时间 O(V+E)。',
    en: 'An edge-biconnected component is a maximal subgraph remaining connected after removing any single edge. Edge (u,v) is a bridge iff low[v] > dfn[u]. The algorithm finds all bridges via DFS, removes them, then computes connected components of the remainder. Time O(V+E).',
  },
  tags: ['graph', 'edge-biconnected', 'bridge', 'dfs', 'undirected'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
