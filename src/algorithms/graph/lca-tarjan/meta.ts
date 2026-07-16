// LCA Tarjan · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lca-tarjan',
  categoryId: 'graph',
  title: { zh: 'LCA并查集', en: 'LCA Tarjan' },
  summary: {
    zh: 'LCA并查集属于graph类别。',
    en: 'LCA Tarjan is a graph algorithm.',
  },
  description: {
    zh: 'LCA并查集（LCA Tarjan）属于graph类别的算法。',
    en: 'LCA Tarjan is an algorithm in the graph category.',
  },
  tags: ["graph","scc","lca"],
  complexity: { time: 'O((n+q) α(n))', space: 'O(n+q)' },
};
