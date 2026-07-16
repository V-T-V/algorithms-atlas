// Bipartite Check (Coloring) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bipartite-check',
  categoryId: 'graph',
  title: { zh: '二分图判定（染色法）', en: 'Bipartite Check (Coloring)' },
  summary: {
    zh: '二分图判定（染色法）属于graph类别。',
    en: 'Bipartite Check (Coloring) is a graph algorithm.',
  },
  description: {
    zh: '二分图判定（染色法）（Bipartite Check (Coloring)）属于graph类别的算法。',
    en: 'Bipartite Check (Coloring) is an algorithm in the graph category.',
  },
  tags: ["graph","bipartite-matching"],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
