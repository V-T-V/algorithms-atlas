// Kth Shortest · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'k-shortest',
  categoryId: 'graph',
  title: { zh: '第K短路', en: 'Kth Shortest' },
  summary: {
    zh: '第K短路属于graph类别。',
    en: 'Kth Shortest is a graph algorithm.',
  },
  description: {
    zh: '第K短路（Kth Shortest）属于graph类别的算法。',
    en: 'Kth Shortest is an algorithm in the graph category.',
  },
  tags: ["graph","shortest-path"],
  complexity: { time: 'O(K · V · (E log V))', space: 'O(K · V)' },
};
