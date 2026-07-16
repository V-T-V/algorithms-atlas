// Min Cost Max Flow · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mcmf',
  categoryId: 'graph',
  title: { zh: '最小费用最大流', en: 'Min Cost Max Flow' },
  summary: {
    zh: '最小费用最大流属于graph类别。',
    en: 'Min Cost Max Flow is a graph algorithm.',
  },
  description: {
    zh: '最小费用最大流（Min Cost Max Flow）属于graph类别的算法。',
    en: 'Min Cost Max Flow is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O(F · V E)', space: 'O(V + E)' },
};
