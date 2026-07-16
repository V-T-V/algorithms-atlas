import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-cut-3',
  categoryId: 'graph',
  title: { zh: '割点（Tarjan 找关节点）', en: 'Cut Vertices (Articulation Points)' },
  summary: {
    zh: '找出无向图中删除后会增加连通分量数的节点（割点 / 关节点）。',
    en: 'Find vertices whose removal increases the number of connected components.',
  },
  description: {
    zh: 'DFS 中：(1) 若 u 是根且子树数 ≥2，则 u 为割点；(2) 若 u 非根且存在子 v 使 low[v] ≥ dfn[u]，则 u 为割点。',
    en: 'Root is a cut vertex if it has ≥2 DFS children; non-root u is a cut vertex if some child v has low[v] ≥ dfn[u].',
  },
  tags: ['graph', 'cut-vertex', 'articulation', 'tarjan'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
