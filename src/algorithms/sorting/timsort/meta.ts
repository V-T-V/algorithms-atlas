// TimSort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'timsort',
  categoryId: 'sorting',
  title: { zh: 'Tim排序', en: 'TimSort' },
  summary: {
    zh: 'Tim排序属于sorting类别。',
    en: 'TimSort is a sorting algorithm.',
  },
  description: {
    zh: 'Tim排序（TimSort）属于sorting类别的算法。',
    en: 'TimSort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
