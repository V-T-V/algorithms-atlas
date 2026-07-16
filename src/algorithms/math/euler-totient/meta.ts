// Euler Totient · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'euler-totient',
  categoryId: 'math',
  title: { zh: '欧拉函数', en: 'Euler Totient' },
  summary: {
    zh: '欧拉函数属于math类别。',
    en: 'Euler Totient is a math algorithm.',
  },
  description: {
    zh: '欧拉函数（Euler Totient）属于math类别的算法。',
    en: 'Euler Totient is an algorithm in the math category.',
  },
  tags: ["math","numerical-method"],
  complexity: { time: 'O(N) sieve / O(√n) single', space: 'O(N)' },
};
