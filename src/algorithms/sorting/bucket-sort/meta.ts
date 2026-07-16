// Bucket Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bucket-sort',
  categoryId: 'sorting',
  title: { zh: '桶排序', en: 'Bucket Sort' },
  summary: {
    zh: '桶排序属于sorting类别。',
    en: 'Bucket Sort is a sorting algorithm.',
  },
  description: {
    zh: '桶排序（Bucket Sort）属于sorting类别的算法。',
    en: 'Bucket Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n + k) average', space: 'O(n + k)' },
};
