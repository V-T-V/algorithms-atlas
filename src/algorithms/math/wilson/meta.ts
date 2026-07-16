// Wilson Theorem · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'wilson',
  categoryId: 'math',
  title: { zh: '威尔逊定理', en: 'Wilson Theorem' },
  summary: {
    zh: '威尔逊定理属于math类别。',
    en: 'Wilson Theorem is a math algorithm.',
  },
  description: {
    zh: '威尔逊定理（Wilson Theorem）属于math类别的算法。',
    en: 'Wilson Theorem is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
