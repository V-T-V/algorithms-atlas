import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-mst-3',
  categoryId: 'graph',
  title: { zh: '最小生成树（Borůvka）', en: 'Minimum Spanning Tree (Boruvka)' },
  summary: {
    zh: '每轮每个连通块各自选最短出边合并，直到只剩一个连通块。',
    en: 'Each round, every component selects its cheapest outgoing edge; merge until one component remains.',
  },
  description: {
    zh: 'Borůvka 算法：初始每个顶点自成一连通块。每轮对所有连通块同时找最短出边，合并之。约 O(E log V)。',
    en: 'Boruvka: each vertex is its own component initially; each round find cheapest outgoing edge per component and merge. O(E log V).',
  },
  tags: ['graph', 'mst', 'boruvka'],
  complexity: { time: 'O(E log V)', space: 'O(V)' },
};
