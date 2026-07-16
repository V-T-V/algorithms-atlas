// Cycle Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cycle-sort',
  categoryId: 'sorting',
  title: { zh: '圈排序', en: 'Cycle Sort' },
  summary: {
    zh: '圈排序属于sorting类别。',
    en: 'Cycle Sort is a sorting algorithm.',
  },
  description: {
    zh: '圈排序（Cycle Sort）属于sorting类别的算法。',
    en: 'Cycle Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting","linked-list"],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
