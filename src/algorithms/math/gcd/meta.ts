// Euclidean GCD · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gcd',
  categoryId: 'math',
  title: { zh: '辗转相除法', en: 'Euclidean GCD' },
  summary: {
    zh: '辗转相除法属于math类别。',
    en: 'Euclidean GCD is a math algorithm.',
  },
  description: {
    zh: '辗转相除法（Euclidean GCD）属于math类别的算法。',
    en: 'Euclidean GCD is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(log min(a,b))', space: 'O(1)' },
};
