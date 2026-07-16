// Sleep Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sleep-sort',
  categoryId: 'sorting',
  title: { zh: '睡眠排序', en: 'Sleep Sort' },
  summary: {
    zh: '睡眠排序属于sorting类别。',
    en: 'Sleep Sort is a sorting algorithm.',
  },
  description: {
    zh: '睡眠排序（Sleep Sort）属于sorting类别的算法。',
    en: 'Sleep Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(max + n)', space: 'O(n)' },
};
