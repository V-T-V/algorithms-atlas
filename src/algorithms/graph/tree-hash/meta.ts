// Tree Hash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-hash',
  categoryId: 'graph',
  title: { zh: '树哈希', en: 'Tree Hash' },
  summary: {
    zh: '树哈希属于graph类别。',
    en: 'Tree Hash is a graph algorithm.',
  },
  description: {
    zh: '树哈希（Tree Hash）属于graph类别的算法。',
    en: 'Tree Hash is an algorithm in the graph category.',
  },
  tags: ["graph","tree","hashing"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
