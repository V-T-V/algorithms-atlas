// Patience Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'patience-sort',
  categoryId: 'sorting',
  title: { zh: '耐心排序', en: 'Patience Sort' },
  summary: {
    zh: '耐心排序属于sorting类别。',
    en: 'Patience Sort is a sorting algorithm.',
  },
  description: {
    zh: '耐心排序（Patience Sort）属于sorting类别的算法。',
    en: 'Patience Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
