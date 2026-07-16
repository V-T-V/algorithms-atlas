// IntroSort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'introsort',
  categoryId: 'sorting',
  title: { zh: '内省排序', en: 'IntroSort' },
  summary: {
    zh: '内省排序属于sorting类别。',
    en: 'IntroSort is a sorting algorithm.',
  },
  description: {
    zh: '内省排序（IntroSort）属于sorting类别的算法。',
    en: 'IntroSort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};
