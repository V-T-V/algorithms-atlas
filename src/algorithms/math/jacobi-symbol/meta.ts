// Jacobi Symbol · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'jacobi-symbol',
  categoryId: 'math',
  title: { zh: '雅可比符号', en: 'Jacobi Symbol' },
  summary: {
    zh: '雅可比符号属于math类别。',
    en: 'Jacobi Symbol is a math algorithm.',
  },
  description: {
    zh: '雅可比符号（Jacobi Symbol）属于math类别的算法。',
    en: 'Jacobi Symbol is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
