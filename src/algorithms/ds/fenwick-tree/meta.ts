// Fenwick Tree (BIT) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fenwick-tree',
  categoryId: 'ds',
  title: { zh: '树状数组', en: 'Fenwick Tree (BIT)' },
  summary: {
    zh: '树状数组属于ds类别。',
    en: 'Fenwick Tree (BIT) is a ds algorithm.',
  },
  description: {
    zh: '树状数组（Fenwick Tree (BIT)）属于ds类别的算法。',
    en: 'Fenwick Tree (BIT) is an algorithm in the ds category.',
  },
  tags: ["ds","tree","range-query"],
  complexity: { time: 'O(log n) 单点加/前缀和', space: 'O(n)' },
};
