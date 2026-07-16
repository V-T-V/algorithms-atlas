// Min_25 Sieve · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'min25',
  categoryId: 'math',
  title: { zh: 'Min_25筛', en: 'Min_25 Sieve' },
  summary: {
    zh: 'Min_25筛属于math类别。',
    en: 'Min_25 Sieve is a math algorithm.',
  },
  description: {
    zh: 'Min_25筛（Min_25 Sieve）属于math类别的算法。',
    en: 'Min_25 Sieve is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(n^{3/4} / log n)', space: 'O(√n)' },
};
