// Hamilton Path · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hamilton-path',
  categoryId: 'backtracking',
  title: { zh: '哈密顿路径', en: 'Hamilton Path' },
  summary: {
    zh: '哈密顿路径属于backtracking类别。',
    en: 'Hamilton Path is a backtracking algorithm.',
  },
  description: {
    zh: '哈密顿路径（Hamilton Path）属于backtracking类别的算法。',
    en: 'Hamilton Path is an algorithm in the backtracking category.',
  },
  tags: ["backtracking"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
