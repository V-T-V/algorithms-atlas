// Suffix Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'suffix-tree',
  categoryId: 'ds',
  title: { zh: '后缀树', en: 'Suffix Tree' },
  summary: {
    zh: '后缀树属于ds类别。',
    en: 'Suffix Tree is a ds algorithm.',
  },
  description: {
    zh: '后缀树（Suffix Tree）属于ds类别的算法。',
    en: 'Suffix Tree is an algorithm in the ds category.',
  },
  tags: ["ds","tree","suffix-structure"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
