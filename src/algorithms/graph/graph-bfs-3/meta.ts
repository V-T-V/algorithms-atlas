import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-bfs-3',
  categoryId: 'graph',
  title: { zh: '分层 BFS（带层级编号）', en: 'Layered BFS with Depth Labels' },
  summary: {
    zh: '广度优先搜索同时记录每个节点所在的层数，逐层展示扩展过程。',
    en: 'BFS recording the depth of each node, expanding one layer at a time.',
  },
  description: {
    zh: '在标准 BFS 基础上为每个节点维护 dist，新发现的邻居 dist=父节点 dist+1。结束时得到从起点到各节点的最短跳数。',
    en: 'Standard BFS plus per-node dist; newly discovered neighbor dist = parent dist + 1. Yields hop-distance from source.',
  },
  tags: ['graph', 'bfs', 'shortest-path'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
