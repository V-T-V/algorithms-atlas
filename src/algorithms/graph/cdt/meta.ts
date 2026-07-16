// Circle Double Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cdt',
  categoryId: 'graph',
  title: { zh: '圆方树', en: 'Circle Double Tree' },
  summary: {
    zh: '圆方树属于graph类别。',
    en: 'Circle Double Tree is a graph algorithm.',
  },
  description: {
    zh: '圆方树（Circle Double Tree）属于graph类别的算法。',
    en: 'Circle Double Tree is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
