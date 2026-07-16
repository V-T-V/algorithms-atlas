// Prim MST · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'prim',
  categoryId: 'graph',
  title: { zh: 'Prim 最小生成树', en: 'Prim MST' },
  summary: {
    zh: 'Prim 最小生成树属于graph类别。',
    en: 'Prim MST is a graph algorithm.',
  },
  description: {
    zh: 'Prim 最小生成树（Prim MST）属于graph类别的算法。',
    en: 'Prim MST is an algorithm in the graph category.',
  },
  tags: ["graph","mst","greedy"],
  complexity: { time: 'O(V²)', space: 'O(V)' },
};
