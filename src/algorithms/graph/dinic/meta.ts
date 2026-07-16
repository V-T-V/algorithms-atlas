// Dinic Max Flow · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dinic',
  categoryId: 'graph',
  title: { zh: 'Dinic 最大流', en: 'Dinic Max Flow' },
  summary: {
    zh: 'Dinic 最大流属于graph类别。',
    en: 'Dinic Max Flow is a graph algorithm.',
  },
  description: {
    zh: 'Dinic 最大流（Dinic Max Flow）属于graph类别的算法。',
    en: 'Dinic Max Flow is an algorithm in the graph category.',
  },
  tags: ["graph","network-flow"],
  complexity: { time: 'O(V²·E)', space: 'O(V+E)' },
};
