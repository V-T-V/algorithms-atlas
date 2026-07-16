// SCC Iterative · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'scc-tarjan-iter',
  categoryId: 'graph',
  title: { zh: '强连通迭代', en: 'SCC Iterative' },
  summary: {
    zh: '强连通迭代属于graph类别。',
    en: 'SCC Iterative is a graph algorithm.',
  },
  description: {
    zh: '强连通迭代（SCC Iterative）属于graph类别的算法。',
    en: 'SCC Iterative is an algorithm in the graph category.',
  },
  tags: ["graph","scc"],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
