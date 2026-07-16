import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-reachable-2',
  categoryId: 'graph',
  title: { zh: '可达节点（DFS/BFS）', en: 'Reachable Nodes (DFS/BFS)' },
  summary: {
    zh: '从源点出发遍历，列出所有可达节点。',
    en: 'Traverse from a source and list all nodes reachable from it.',
  },
  description: {
    zh: '在有向（或无向）图中，从给定源点出发进行 DFS/BFS 遍历，收集所有可达节点。本实现用 BFS。时间 O(V+E)，空间 O(V)。',
    en: 'DFS/BFS from a source over a directed/undirected graph, collecting reachable nodes. BFS here. Time O(V+E), space O(V).',
  },
  tags: ['graph', 'bfs', 'dfs', 'traversal', 'reachability'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
