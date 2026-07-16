// Multiplication LCA · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mult',
  categoryId: 'graph',
  title: { zh: '倍增LCA', en: 'Multiplication LCA' },
  summary: {
    zh: '倍增LCA属于graph类别。',
    en: 'Multiplication LCA is a graph algorithm.',
  },
  description: {
    zh: '倍增LCA（Multiplication LCA）属于graph类别的算法。',
    en: 'Multiplication LCA is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(n log n) build, O(log n) query', space: 'O(n log n)' },
};
