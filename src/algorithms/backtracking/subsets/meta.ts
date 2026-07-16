// Subsets · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'subsets',
  categoryId: 'backtracking',
  title: { zh: '子集枚举', en: 'Subsets' },
  summary: {
    zh: '子集枚举属于backtracking类别。',
    en: 'Subsets is a backtracking algorithm.',
  },
  description: {
    zh: '子集枚举（Subsets）属于backtracking类别的算法。',
    en: 'Subsets is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n·2ⁿ)', space: 'O(n)' },
};
