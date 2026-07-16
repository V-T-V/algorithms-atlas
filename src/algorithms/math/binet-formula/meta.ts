// Binet Formula · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binet-formula',
  categoryId: 'math',
  title: { zh: '比内公式', en: 'Binet Formula' },
  summary: {
    zh: '比内公式属于math类别。',
    en: 'Binet Formula is a math algorithm.',
  },
  description: {
    zh: '比内公式（Binet Formula）属于math类别的算法。',
    en: 'Binet Formula is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
