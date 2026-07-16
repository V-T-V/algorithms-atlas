// N-Queens · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'n-queens',
  categoryId: 'backtracking',
  title: { zh: 'N 皇后', en: 'N-Queens' },
  summary: {
    zh: 'N 皇后属于backtracking类别。',
    en: 'N-Queens is a backtracking algorithm.',
  },
  description: {
    zh: 'N 皇后（N-Queens）属于backtracking类别的算法。',
    en: 'N-Queens is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n!)', space: 'O(n)' },
};
