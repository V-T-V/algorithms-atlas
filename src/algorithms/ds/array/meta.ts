// Dynamic Array · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'array',
  categoryId: 'ds',
  title: { zh: '动态数组', en: 'Dynamic Array' },
  summary: {
    zh: '动态数组属于ds类别。',
    en: 'Dynamic Array is a ds algorithm.',
  },
  description: {
    zh: '动态数组（Dynamic Array）属于ds类别的算法。',
    en: 'Dynamic Array is an algorithm in the ds category.',
  },
  tags: ["ds"],
  complexity: { time: 'O(1) push (均摊)', space: 'O(n)' },
};
