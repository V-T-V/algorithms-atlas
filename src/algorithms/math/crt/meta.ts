// Chinese Remainder Theorem · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crt',
  categoryId: 'math',
  title: { zh: '中国剩余定理', en: 'Chinese Remainder Theorem' },
  summary: {
    zh: '中国剩余定理属于math类别。',
    en: 'Chinese Remainder Theorem is a math algorithm.',
  },
  description: {
    zh: '中国剩余定理（Chinese Remainder Theorem）属于math类别的算法。',
    en: 'Chinese Remainder Theorem is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(n · log(max m))', space: 'O(1)' },
};
