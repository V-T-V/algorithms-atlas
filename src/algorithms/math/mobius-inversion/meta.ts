// Mobius Inversion · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mobius-inversion',
  categoryId: 'math',
  title: { zh: '莫比乌斯反演', en: 'Mobius Inversion' },
  summary: {
    zh: '莫比乌斯反演属于math类别。',
    en: 'Mobius Inversion is a math algorithm.',
  },
  description: {
    zh: '莫比乌斯反演（Mobius Inversion）属于math类别的算法。',
    en: 'Mobius Inversion is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(n) sieve / O(√n) per inversion', space: 'O(n)' },
};
