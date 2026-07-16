// Comb Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comb-sort',
  categoryId: 'sorting',
  title: { zh: '梳排序', en: 'Comb Sort' },
  summary: {
    zh: '梳排序属于sorting类别。',
    en: 'Comb Sort is a sorting algorithm.',
  },
  description: {
    zh: '梳排序（Comb Sort）属于sorting类别的算法。',
    en: 'Comb Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
