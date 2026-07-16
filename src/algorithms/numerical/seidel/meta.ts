// Gauss-Seidel · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'seidel',
  categoryId: 'numerical',
  title: { zh: '高斯-塞德尔', en: 'Gauss-Seidel' },
  summary: {
    zh: '高斯-塞德尔属于numerical类别。',
    en: 'Gauss-Seidel is a numerical algorithm.',
  },
  description: {
    zh: '高斯-塞德尔（Gauss-Seidel）属于numerical类别的算法。',
    en: 'Gauss-Seidel is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(k·n²)', space: 'O(n)' },
};
