// Strongly Connected (Kosaraju) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'strongly-connected',
  categoryId: 'graph',
  title: { zh: '强连通分量（Kosaraju）', en: 'Strongly Connected (Kosaraju)' },
  summary: {
    zh: '强连通分量（Kosaraju）属于graph类别。',
    en: 'Strongly Connected (Kosaraju) is a graph algorithm.',
  },
  description: {
    zh: '强连通分量（Kosaraju）（Strongly Connected (Kosaraju)）属于graph类别的算法。',
    en: 'Strongly Connected (Kosaraju) is an algorithm in the graph category.',
  },
  tags: ["graph","scc"],
  complexity: { time: 'O(V + E)', space: 'O(V + E)' },
};
