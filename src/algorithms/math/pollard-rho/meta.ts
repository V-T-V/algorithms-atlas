// Pollard Rho Factorization · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pollard-rho',
  categoryId: 'math',
  title: { zh: 'Pollard-Rho 分解', en: 'Pollard Rho Factorization' },
  summary: {
    zh: 'Pollard-Rho 分解属于math类别。',
    en: 'Pollard Rho Factorization is a math algorithm.',
  },
  description: {
    zh: 'Pollard-Rho 分解（Pollard Rho Factorization）属于math类别的算法。',
    en: 'Pollard Rho Factorization is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(n^(1/4))', space: 'O(log n)' },
};
