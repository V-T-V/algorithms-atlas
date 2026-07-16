// Octree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'octree',
  categoryId: 'ds',
  title: { zh: '八叉树', en: 'Octree' },
  summary: {
    zh: '八叉树属于ds类别。',
    en: 'Octree is a ds algorithm.',
  },
  description: {
    zh: '八叉树（Octree）属于ds类别的算法。',
    en: 'Octree is an algorithm in the ds category.',
  },
  tags: ["ds","tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
