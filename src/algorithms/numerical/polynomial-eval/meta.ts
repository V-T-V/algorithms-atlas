// Polynomial Eval · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'polynomial-eval',
  categoryId: 'numerical',
  title: { zh: '多项式求值', en: 'Polynomial Eval' },
  summary: {
    zh: '多项式求值属于numerical类别。',
    en: 'Polynomial Eval is a numerical algorithm.',
  },
  description: {
    zh: '多项式求值（Polynomial Eval）属于numerical类别的算法。',
    en: 'Polynomial Eval is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
