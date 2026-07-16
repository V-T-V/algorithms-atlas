// DAG Shortest · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'shortest-dag',
  categoryId: 'graph',
  title: { zh: 'DAG最短路', en: 'DAG Shortest' },
  summary: {
    zh: 'DAG最短路属于graph类别。',
    en: 'DAG Shortest is a graph algorithm.',
  },
  description: {
    zh: 'DAG最短路（DAG Shortest）属于graph类别的算法。',
    en: 'DAG Shortest is an algorithm in the graph category.',
  },
  tags: ["graph","shortest-path"],
  complexity: { time: 'O(V + E)', space: 'O(V + E)' },
};
