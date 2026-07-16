import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'biconnected-component',
  categoryId: 'graph',
  title: { zh: '点双连通分量', en: 'Biconnected Component' },
  summary: {
    zh: 'DFS 维护 dfn/low 与边栈，求无向图的块与割点。',
    en: 'DFS with dfn/low and an edge stack to find blocks and cut vertices.',
  },
  description: {
    zh: '点双连通分量（块）是无向图中的极大点双连通子图：其中任意两点之间至少有两条不相交（无公共顶点）的路径。算法在 DFS 中维护 dfn（发现序）和 low（能回溯到的最小 dfn），并用一个边栈记录已走过的边。当子节点 v 满足 low[v] >= dfn[u] 时，u 是割点，将边栈弹到边 (u,v) 即得到一个块。根节点是割点当且仅当它在 DFS 树中有至少两个子节点。时间 O(V+E)。',
    en: 'A biconnected component (block) is a maximal subgraph in which any two vertices are connected by at least two internally vertex-disjoint paths. DFS maintains dfn and low plus an edge stack; when a child v satisfies low[v] >= dfn[u], u is a cut vertex and we pop the edge stack down to (u,v) to form one block. The root is a cut vertex iff it has two or more DFS children. Time O(V+E).',
  },
  tags: ['graph', 'biconnected', 'cut-vertex', 'dfs', 'undirected'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
