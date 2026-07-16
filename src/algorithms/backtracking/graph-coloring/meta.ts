// Graph Coloring · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-coloring',
  categoryId: 'backtracking',
  title: { zh: '图着色', en: 'Graph Coloring' },
  summary: {
    zh: '图着色属于backtracking类别。',
    en: 'Graph Coloring is a backtracking algorithm.',
  },
  description: {
    zh: '图着色（Graph Coloring）属于backtracking类别的算法。',
    en: 'Graph Coloring is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
