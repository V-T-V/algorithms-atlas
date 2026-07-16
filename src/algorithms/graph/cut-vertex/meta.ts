// Cut Vertex · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cut-vertex',
  categoryId: 'graph',
  title: { zh: '割点', en: 'Cut Vertex' },
  summary: {
    zh: '割点属于graph类别。',
    en: 'Cut Vertex is a graph algorithm.',
  },
  description: {
    zh: '割点（Cut Vertex）属于graph类别的算法。',
    en: 'Cut Vertex is an algorithm in the graph category.',
  },
  tags: ["graph","graph-connectivity"],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
