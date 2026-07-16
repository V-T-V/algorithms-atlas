// Second MST · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mst-kruskal-2',
  categoryId: 'graph',
  title: { zh: '次小生成树', en: 'Second MST' },
  summary: {
    zh: '次小生成树属于graph类别。',
    en: 'Second MST is a graph algorithm.',
  },
  description: {
    zh: '次小生成树（Second MST）属于graph类别的算法。',
    en: 'Second MST is an algorithm in the graph category.',
  },
  tags: ["graph","mst","greedy"],
  complexity: { time: 'O(E log V)', space: 'O(V + E)' },
};
