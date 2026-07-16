// Articulation Point DFS · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'articulation-point-dfs',
  categoryId: 'graph',
  title: { zh: '割点·标准 DFS', en: 'Articulation Point (Standard DFS)' },
  summary: {
    zh: '标准 DFS 模板求无向连通图的割点（关节点）。',
    en: 'Standard DFS template to find articulation points in an undirected connected graph.',
  },
  description: {
    zh: '割点（articulation point / cut vertex）是删除后会使连通分量数增加的节点。DFS 中维护 dfn/low：根节点若有 ≥2 个 DFS 子树则为割点；非根节点 u 若存在子节点 v 使 low[v] >= dfn[u]，则 u 为割点。时间 O(V+E)。',
    en: 'An articulation point is a vertex whose removal increases the number of connected components. DFS maintains dfn/low: the root is a cut vertex if it has ≥2 DFS children; a non-root u is a cut vertex if some child v has low[v] >= dfn[u]. Time O(V+E).',
  },
  tags: ['graph', 'articulation-point', 'cut-vertex', 'dfs', 'undirected'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
