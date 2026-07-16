// SPFA · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'spfa',
  categoryId: 'graph',
  title: { zh: '最短路径 SPFA', en: 'SPFA' },
  summary: {
    zh: '最短路径 SPFA属于graph类别。',
    en: 'SPFA is a graph algorithm.',
  },
  description: {
    zh: '最短路径 SPFA（SPFA）属于graph类别的算法。',
    en: 'SPFA is an algorithm in the graph category.',
  },
  tags: ["graph","shortest-path"],
  complexity: { time: 'O(V·E) 最坏', space: 'O(V)' },
};
