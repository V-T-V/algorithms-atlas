// DSU on Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dsu-on-tree',
  categoryId: 'graph',
  title: { zh: '树上启发式合并', en: 'DSU on Tree' },
  summary: {
    zh: '树上启发式合并属于graph类别。',
    en: 'DSU on Tree is a graph algorithm.',
  },
  description: {
    zh: '树上启发式合并（DSU on Tree）属于graph类别的算法。',
    en: 'DSU on Tree is an algorithm in the graph category.',
  },
  tags: ["graph","tree"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
