// Dominator Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dominator',
  categoryId: 'graph',
  title: { zh: '支配树', en: 'Dominator Tree' },
  summary: {
    zh: '支配树属于graph类别。',
    en: 'Dominator Tree is a graph algorithm.',
  },
  description: {
    zh: '支配树（Dominator Tree）属于graph类别的算法。',
    en: 'Dominator Tree is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(E·α(V))', space: 'O(V+E)' },
};
