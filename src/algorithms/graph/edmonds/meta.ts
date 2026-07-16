// Edmonds MST · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'edmonds',
  categoryId: 'graph',
  title: { zh: '有向MST', en: 'Edmonds MST' },
  summary: {
    zh: '有向MST属于graph类别。',
    en: 'Edmonds MST is a graph algorithm.',
  },
  description: {
    zh: '有向MST（Edmonds MST）属于graph类别的算法。',
    en: 'Edmonds MST is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(V E)', space: 'O(V + E)' },
};
