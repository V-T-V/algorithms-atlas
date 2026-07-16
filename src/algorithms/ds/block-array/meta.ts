// Block Array · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'block-array',
  categoryId: 'ds',
  title: { zh: '分块数组', en: 'Block Array' },
  summary: {
    zh: '分块数组属于ds类别。',
    en: 'Block Array is a ds algorithm.',
  },
  description: {
    zh: '分块数组（Block Array）属于ds类别的算法。',
    en: 'Block Array is an algorithm in the ds category.',
  },
  tags: ["ds","range-query"],
  complexity: { time: 'O(√n)', space: 'O(n)' },
};
