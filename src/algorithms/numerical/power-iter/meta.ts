// Power Iteration · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'power-iter',
  categoryId: 'numerical',
  title: { zh: '幂迭代求特征值', en: 'Power Iteration' },
  summary: {
    zh: '幂迭代求特征值属于numerical类别。',
    en: 'Power Iteration is a numerical algorithm.',
  },
  description: {
    zh: '幂迭代求特征值（Power Iteration）属于numerical类别的算法。',
    en: 'Power Iteration is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(k·n²)', space: 'O(n)' },
};
