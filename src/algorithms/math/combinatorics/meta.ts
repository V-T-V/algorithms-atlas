// Combinatorics (Binomial Coefficients) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'combinatorics',
  categoryId: 'math',
  title: { zh: '组合数', en: 'Combinatorics (Binomial Coefficients)' },
  summary: {
    zh: '组合数属于math类别。',
    en: 'Combinatorics (Binomial Coefficients) is a math algorithm.',
  },
  description: {
    zh: '组合数（Combinatorics (Binomial Coefficients)）属于math类别的算法。',
    en: 'Combinatorics (Binomial Coefficients) is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(N) preprocess, O(1) query', space: 'O(N)' },
};
