// Virtual Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'virtual-tree',
  categoryId: 'graph',
  title: { zh: '虚树', en: 'Virtual Tree' },
  summary: {
    zh: '虚树属于graph类别。',
    en: 'Virtual Tree is a graph algorithm.',
  },
  description: {
    zh: '虚树（Virtual Tree）属于graph类别的算法。',
    en: 'Virtual Tree is an algorithm in the graph category.',
  },
  tags: ["graph","tree","tree-decomposition"],
  complexity: { time: 'O(k log n)', space: 'O(n)' },
};
