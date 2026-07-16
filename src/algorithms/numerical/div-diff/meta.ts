// Divided Difference · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'div-diff',
  categoryId: 'numerical',
  title: { zh: '差商', en: 'Divided Difference' },
  summary: {
    zh: '差商属于numerical类别。',
    en: 'Divided Difference is a numerical algorithm.',
  },
  description: {
    zh: '差商（Divided Difference）属于numerical类别的算法。',
    en: 'Divided Difference is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
