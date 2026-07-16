// Bipartite Vertex Cover · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bistar',
  categoryId: 'graph',
  title: { zh: '二分图点覆盖', en: 'Bipartite Vertex Cover' },
  summary: {
    zh: '二分图点覆盖属于graph类别。',
    en: 'Bipartite Vertex Cover is a graph algorithm.',
  },
  description: {
    zh: '二分图点覆盖（Bipartite Vertex Cover）属于graph类别的算法。',
    en: 'Bipartite Vertex Cover is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(V E)', space: 'O(V + E)' },
};
