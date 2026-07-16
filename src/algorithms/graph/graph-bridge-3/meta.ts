import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-bridge-3',
  categoryId: 'graph',
  title: { zh: '桥（Tarjan 找割边）', en: 'Bridges (Tarjan Cut Edges)' },
  summary: {
    zh: '找出无向图中删除后会使图不连通的边（桥）。',
    en: 'Find edges whose removal disconnects the graph (bridges).',
  },
  description: {
    zh: 'DFS 维护 dfn/low。对于边 (u,v)，若 low[v] > dfn[u]，则 (u,v) 为桥。',
    en: 'Track dfn/low in DFS; edge (u,v) is a bridge when low[v] > dfn[u].',
  },
  tags: ['graph', 'bridge', 'tarjan'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
