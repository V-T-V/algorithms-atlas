// Spaghetti Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'spaghetti-sort',
  categoryId: 'sorting',
  title: { zh: '意大利面排序', en: 'Spaghetti Sort' },
  summary: {
    zh: '意大利面排序属于sorting类别。',
    en: 'Spaghetti Sort is a sorting algorithm.',
  },
  description: {
    zh: '意大利面排序（Spaghetti Sort）属于sorting类别的算法。',
    en: 'Spaghetti Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n + range)', space: 'O(range)' },
};
