// Sparse Table · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'disjoint',
  categoryId: 'ds',
  title: { zh: '稀疏表 Sparse Table', en: 'Sparse Table' },
  summary: {
    zh: '稀疏表 Sparse Table属于ds类别。',
    en: 'Sparse Table is a ds algorithm.',
  },
  description: {
    zh: '稀疏表 Sparse Table（Sparse Table）属于ds类别的算法。',
    en: 'Sparse Table is an algorithm in the ds category.',
  },
  tags: ["ds","union-find"],
  complexity: { time: 'O(1)', space: 'O(n log n)' },
};
