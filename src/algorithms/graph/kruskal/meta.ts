// Kruskal MST · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kruskal',
  categoryId: 'graph',
  title: { zh: 'Kruskal 最小生成树', en: 'Kruskal MST' },
  summary: {
    zh: 'Kruskal 最小生成树属于graph类别。',
    en: 'Kruskal MST is a graph algorithm.',
  },
  description: {
    zh: 'Kruskal 最小生成树（Kruskal MST）属于graph类别的算法。',
    en: 'Kruskal MST is an algorithm in the graph category.',
  },
  tags: ["graph","mst","greedy"],
  complexity: { time: 'O(E log E)', space: 'O(V)' },
};
