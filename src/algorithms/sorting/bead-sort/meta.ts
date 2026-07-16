// Bead Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bead-sort',
  categoryId: 'sorting',
  title: { zh: '珠排序', en: 'Bead Sort' },
  summary: {
    zh: '珠排序属于sorting类别。',
    en: 'Bead Sort is a sorting algorithm.',
  },
  description: {
    zh: '珠排序（Bead Sort）属于sorting类别的算法。',
    en: 'Bead Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n·m)', space: 'O(n·m)' },
};
