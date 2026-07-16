// Jacobi Iteration · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jacobi',
  categoryId: 'numerical',
  title: { zh: '雅可比迭代', en: 'Jacobi Iteration' },
  summary: {
    zh: '雅可比迭代属于numerical类别。',
    en: 'Jacobi Iteration is a numerical algorithm.',
  },
  description: {
    zh: '雅可比迭代（Jacobi Iteration）属于numerical类别的算法。',
    en: 'Jacobi Iteration is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(k·n²)', space: 'O(n)' },
};
