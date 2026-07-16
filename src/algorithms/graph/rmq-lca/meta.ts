// RMQ-LCA · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rmq-lca',
  categoryId: 'graph',
  title: { zh: 'RMQ求LCA', en: 'RMQ-LCA' },
  summary: {
    zh: 'RMQ求LCA属于graph类别。',
    en: 'RMQ-LCA is a graph algorithm.',
  },
  description: {
    zh: 'RMQ求LCA（RMQ-LCA）属于graph类别的算法。',
    en: 'RMQ-LCA is an algorithm in the graph category.',
  },
  tags: ["graph","lca"],
  complexity: { time: 'O(n log n) build, O(1) query', space: 'O(n log n)' },
};
