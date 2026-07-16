// Kosaraju Refine · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kosaraju-2',
  categoryId: 'graph',
  title: { zh: 'Kosaraju优化', en: 'Kosaraju Refine' },
  summary: {
    zh: 'Kosaraju优化属于graph类别。',
    en: 'Kosaraju Refine is a graph algorithm.',
  },
  description: {
    zh: 'Kosaraju优化（Kosaraju Refine）属于graph类别的算法。',
    en: 'Kosaraju Refine is an algorithm in the graph category.',
  },
  tags: ["graph","scc"],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
