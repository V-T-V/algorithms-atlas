// Johnson · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'johnson',
  categoryId: 'graph',
  title: { zh: 'Johnson 全源最短路', en: 'Johnson' },
  summary: {
    zh: 'Johnson 全源最短路属于graph类别。',
    en: 'Johnson is a graph algorithm.',
  },
  description: {
    zh: 'Johnson 全源最短路（Johnson）属于graph类别的算法。',
    en: 'Johnson is an algorithm in the graph category.',
  },
  tags: ["graph","shortest-path"],
  complexity: { time: 'O(V·E + V·(V+E) log V)', space: 'O(V²)' },
};
