import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-sp-3',
  categoryId: 'graph',
  title: { zh: 'DAG 最短路（拓扑+DP）', en: 'Shortest Path on DAG (Topo + DP)' },
  summary: {
    zh: '对有向无环图先拓扑排序，再按拓扑序一次松弛得到单源最短路。',
    en: 'Topologically sort a DAG, then relax edges once in topo order for single-source shortest path.',
  },
  description: {
    zh: 'DAG 无环，按拓扑序遍历每个节点 u 并松弛其出边即可。即使存在负权边也只需 O(V+E)。',
    en: 'On a DAG, iterate vertices in topo order and relax outgoing edges. Handles negative weights in O(V+E).',
  },
  tags: ['graph', 'shortest-path', 'dag', 'topological'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
