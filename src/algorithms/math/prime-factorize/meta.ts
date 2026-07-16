// Prime Factorization · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'prime-factorize',
  categoryId: 'math',
  title: { zh: '质因数分解', en: 'Prime Factorization' },
  summary: {
    zh: '质因数分解属于math类别。',
    en: 'Prime Factorization is a math algorithm.',
  },
  description: {
    zh: '质因数分解（Prime Factorization）属于math类别的算法。',
    en: 'Prime Factorization is an algorithm in the math category.',
  },
  tags: ["math","mst","greedy","number-theory"],
  complexity: { time: 'O(√n)', space: 'O(log n)' },
};
