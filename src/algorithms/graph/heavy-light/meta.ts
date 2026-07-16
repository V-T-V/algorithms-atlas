// Heavy-Light Decomposition · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'heavy-light',
  categoryId: 'graph',
  title: { zh: '树链剖分', en: 'Heavy-Light Decomposition' },
  summary: {
    zh: '树链剖分属于graph类别。',
    en: 'Heavy-Light Decomposition is a graph algorithm.',
  },
  description: {
    zh: '树链剖分（Heavy-Light Decomposition）属于graph类别的算法。',
    en: 'Heavy-Light Decomposition is an algorithm in the graph category.',
  },
  tags: ["graph","tree-decomposition"],
  complexity: { time: 'O(n) build, O(log n) query', space: 'O(n)' },
};
