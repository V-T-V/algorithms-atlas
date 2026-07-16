// Hungarian Algorithm (Bipartite Matching) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hungarian',
  categoryId: 'graph',
  title: { zh: '匈牙利算法（二分图最大匹配）', en: 'Hungarian Algorithm (Bipartite Matching)' },
  summary: {
    zh: '匈牙利算法（二分图最大匹配）属于graph类别。',
    en: 'Hungarian Algorithm (Bipartite Matching) is a graph algorithm.',
  },
  description: {
    zh: '匈牙利算法（二分图最大匹配）（Hungarian Algorithm (Bipartite Matching)）属于graph类别的算法。',
    en: 'Hungarian Algorithm (Bipartite Matching) is an algorithm in the graph category.',
  },
  tags: ["graph","bipartite-matching"],
  complexity: { time: 'O(V·E)', space: 'O(V+E)' },
};
