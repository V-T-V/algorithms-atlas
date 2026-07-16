// Secant Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'secant',
  categoryId: 'numerical',
  title: { zh: '割线法', en: 'Secant Method' },
  summary: {
    zh: '割线法属于numerical类别。',
    en: 'Secant Method is a numerical algorithm.',
  },
  description: {
    zh: '割线法（Secant Method）属于numerical类别的算法。',
    en: 'Secant Method is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
