// Bisection Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bisection',
  categoryId: 'numerical',
  title: { zh: '二分法求根', en: 'Bisection Method' },
  summary: {
    zh: '二分法求根属于numerical类别。',
    en: 'Bisection Method is a numerical algorithm.',
  },
  description: {
    zh: '二分法求根（Bisection Method）属于numerical类别的算法。',
    en: 'Bisection Method is an algorithm in the numerical category.',
  },
  tags: ["numerical","searching","numerical-method"],
  complexity: { time: 'O(log((hi-lo)/tol))', space: 'O(1)' },
};
