// Mo · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mo-algorithm',
  categoryId: 'ds',
  title: { zh: '莫队算法', en: 'Mo' },
  summary: {
    zh: '莫队算法属于ds类别。',
    en: 'Mo is a ds algorithm.',
  },
  description: {
    zh: '莫队算法（Mo）属于ds类别的算法。',
    en: 'Mo is an algorithm in the ds category.',
  },
  tags: ["ds"],
  complexity: { time: 'O((n+q)√n)', space: 'O(n + 值域)' },
};
