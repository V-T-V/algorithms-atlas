// Bogo Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bogo-sort',
  categoryId: 'sorting',
  title: { zh: '猴子排序', en: 'Bogo Sort' },
  summary: {
    zh: '猴子排序属于sorting类别。',
    en: 'Bogo Sort is a sorting algorithm.',
  },
  description: {
    zh: '猴子排序（Bogo Sort）属于sorting类别的算法。',
    en: 'Bogo Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n·n!)', space: 'O(n)' },
};
