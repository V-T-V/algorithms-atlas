// Tarjan SCC · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tarjan-scc',
  categoryId: 'graph',
  title: { zh: 'Tarjan 强连通分量', en: 'Tarjan SCC' },
  summary: {
    zh: 'Tarjan 强连通分量属于graph类别。',
    en: 'Tarjan SCC is a graph algorithm.',
  },
  description: {
    zh: 'Tarjan 强连通分量（Tarjan SCC）属于graph类别的算法。',
    en: 'Tarjan SCC is an algorithm in the graph category.',
  },
  tags: ["graph","scc"],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
