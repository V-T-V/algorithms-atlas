import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-uf-component',
  categoryId: 'graph',
  title: { zh: '并查集连通分量', en: 'Union-Find Components' },
  summary: {
    zh: '用并查集统计无向图的连通分量数。',
    en: 'Count connected components of an undirected graph via union-find.',
  },
  description: {
    zh: '给定无向图（节点列表 nodes、边列表 edges），用并查集（按秩合并 + 路径压缩）求连通分量数。初始每个节点自成一集合；对每条边 union 两端点；最终不同根的个数即分量数。单次查询/合并近似 O(α(n))，总体 O((V+E)·α)。空间 O(V)。',
    en: 'For an undirected graph (nodes, edges), union-find (union by rank + path compression) counts connected components. Each node starts as its own set; union endpoints of each edge; distinct roots = component count. Per op ≈ O(α(n)); total O((V+E)·α). Space O(V).',
  },
  tags: ['union-find', 'disjoint-set', 'connectivity'],
  complexity: { time: 'O((V+E)·α(V))', space: 'O(V)' },
};
