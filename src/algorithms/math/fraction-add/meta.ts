// Fraction Add · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fraction-add',
  categoryId: 'math',
  title: { zh: '分数加法', en: 'Fraction Add' },
  summary: {
    zh: '分数加法属于math类别。',
    en: 'Fraction Add is a math algorithm.',
  },
  description: {
    zh: '分数加法（Fraction Add）属于math类别的算法。',
    en: 'Fraction Add is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(m · log max)', space: 'O(1)' },
};
