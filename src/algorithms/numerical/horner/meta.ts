// Horner Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'horner',
  categoryId: 'numerical',
  title: { zh: '秦九韶算法', en: 'Horner Method' },
  summary: {
    zh: '秦九韶算法属于numerical类别。',
    en: 'Horner Method is a numerical algorithm.',
  },
  description: {
    zh: '秦九韶算法（Horner Method）属于numerical类别的算法。',
    en: 'Horner Method is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
