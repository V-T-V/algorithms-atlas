// Bridge Finding Iterative · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bridge-finding-iter',
  categoryId: 'graph',
  title: { zh: '找桥·迭代 DFS', en: 'Bridge Finding (Iterative)' },
  summary: {
    zh: '迭代版 DFS 求无向图的桥（割边）。',
    en: 'Iterative DFS to find bridges (cut edges) in an undirected graph.',
  },
  description: {
    zh: '桥是删除后使连通分量数增加的边。DFS 中对树边 u—v，若 low[v] > dfn[u]（注意严格大于），则该边为桥。本实现用显式栈避免递归栈溢出。需跳过「父边」时要用边 id 区分重边，本实现对每条无向边拆成两条有向边并用编号配对。时间 O(V+E)。',
    en: 'A bridge is an edge whose removal increases the number of components. For a tree edge u—v, if low[v] > dfn[u] (strictly greater), the edge is a bridge. This iterative version uses an explicit stack. To handle parallel edges we pair directed half-edges by id. Time O(V+E).',
  },
  tags: ['graph', 'bridge', 'cut-edge', 'dfs', 'iterative', 'undirected'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
