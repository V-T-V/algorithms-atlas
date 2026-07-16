// Median of Medians · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'median-of-medians',
  categoryId: 'selection',
  title: { zh: '中位数的中位数', en: 'Median of Medians' },
  summary: {
    zh: '中位数的中位数属于selection类别。',
    en: 'Median of Medians is a selection algorithm.',
  },
  description: {
    zh: '中位数的中位数（Median of Medians）属于selection类别的算法。',
    en: 'Median of Medians is an algorithm in the selection category.',
  },
  tags: ["selection"],
  complexity: { time: 'O(n)', space: 'O(log n)' },
};
