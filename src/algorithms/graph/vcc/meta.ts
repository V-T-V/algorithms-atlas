// Vertex Biconnected · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'vcc',
  categoryId: 'graph',
  title: { zh: '点双连通', en: 'Vertex Biconnected' },
  summary: {
    zh: '点双连通属于graph类别。',
    en: 'Vertex Biconnected is a graph algorithm.',
  },
  description: {
    zh: '点双连通（Vertex Biconnected）属于graph类别的算法。',
    en: 'Vertex Biconnected is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
