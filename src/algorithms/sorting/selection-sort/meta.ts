// Selection Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'selection-sort',
  categoryId: 'sorting',
  title: { zh: '选择排序', en: 'Selection Sort' },
  summary: {
    zh: '选择排序属于sorting类别。',
    en: 'Selection Sort is a sorting algorithm.',
  },
  description: {
    zh: '选择排序（Selection Sort）属于sorting类别的算法。',
    en: 'Selection Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
