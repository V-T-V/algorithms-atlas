// Heap Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'heap-sort',
  categoryId: 'sorting',
  title: { zh: '堆排序', en: 'Heap Sort' },
  summary: {
    zh: '堆排序属于sorting类别。',
    en: 'Heap Sort is a sorting algorithm.',
  },
  description: {
    zh: '堆排序（Heap Sort）属于sorting类别的算法。',
    en: 'Heap Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting","data-structure"],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
