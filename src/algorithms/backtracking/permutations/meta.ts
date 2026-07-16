// Permutations · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'permutations',
  categoryId: 'backtracking',
  title: { zh: '全排列', en: 'Permutations' },
  summary: {
    zh: '全排列属于backtracking类别。',
    en: 'Permutations is a backtracking algorithm.',
  },
  description: {
    zh: '全排列（Permutations）属于backtracking类别的算法。',
    en: 'Permutations is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n·n!)', space: 'O(n)' },
};
