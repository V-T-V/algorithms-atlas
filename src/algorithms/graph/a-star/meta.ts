// A* Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'a-star',
  categoryId: 'graph',
  title: { zh: 'A* 寻路', en: 'A* Search' },
  summary: {
    zh: 'A* 寻路属于graph类别。',
    en: 'A* Search is a graph algorithm.',
  },
  description: {
    zh: 'A* 寻路（A* Search）属于graph类别的算法。',
    en: 'A* Search is an algorithm in the graph category.',
  },
  tags: ["graph"],
  complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
};
