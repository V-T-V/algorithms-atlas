// Bridge · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bridge',
  categoryId: 'graph',
  title: { zh: '桥', en: 'Bridge' },
  summary: {
    zh: '桥属于graph类别。',
    en: 'Bridge is a graph algorithm.',
  },
  description: {
    zh: '桥（Bridge）属于graph类别的算法。',
    en: 'Bridge is an algorithm in the graph category.',
  },
  tags: ["graph","graph-connectivity"],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
