// Cartesian Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cartesian',
  categoryId: 'graph',
  title: { zh: '笛卡尔树', en: 'Cartesian Tree' },
  summary: {
    zh: '笛卡尔树属于graph类别。',
    en: 'Cartesian Tree is a graph algorithm.',
  },
  description: {
    zh: '笛卡尔树（Cartesian Tree）属于graph类别的算法。',
    en: 'Cartesian Tree is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
