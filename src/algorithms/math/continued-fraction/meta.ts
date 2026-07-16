// Continued Fraction · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'continued-fraction',
  categoryId: 'math',
  title: { zh: '连分数', en: 'Continued Fraction' },
  summary: {
    zh: '连分数属于math类别。',
    en: 'Continued Fraction is a math algorithm.',
  },
  description: {
    zh: '连分数（Continued Fraction）属于math类别的算法。',
    en: 'Continued Fraction is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(log max)', space: 'O(log max)' },
};
