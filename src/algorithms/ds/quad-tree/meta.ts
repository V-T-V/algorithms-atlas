// Quad Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'quad-tree',
  categoryId: 'ds',
  title: { zh: '四叉树', en: 'Quad Tree' },
  summary: {
    zh: '四叉树属于ds类别。',
    en: 'Quad Tree is a ds algorithm.',
  },
  description: {
    zh: '四叉树（Quad Tree）属于ds类别的算法。',
    en: 'Quad Tree is an algorithm in the ds category.',
  },
  tags: ["ds","tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
