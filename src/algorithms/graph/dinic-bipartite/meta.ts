// Dinic Weighted · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dinic-bipartite',
  categoryId: 'graph',
  title: { zh: 'Dinic加权', en: 'Dinic Weighted' },
  summary: {
    zh: 'Dinic加权属于graph类别。',
    en: 'Dinic Weighted is a graph algorithm.',
  },
  description: {
    zh: 'Dinic加权（Dinic Weighted）属于graph类别的算法。',
    en: 'Dinic Weighted is an algorithm in the graph category.',
  },
  tags: ["graph","network-flow","bipartite-matching"],
  complexity: { time: 'O(E√V)', space: 'O(V + E)' },
};
