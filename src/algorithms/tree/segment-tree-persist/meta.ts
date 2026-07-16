// Persistent Seg · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'segment-tree-persist',
  categoryId: 'tree',
  title: { zh: '主席树', en: 'Persistent Seg' },
  summary: {
    zh: '主席树属于tree类别。',
    en: 'Persistent Seg is a tree algorithm.',
  },
  description: {
    zh: '主席树（Persistent Seg）属于tree类别的算法。',
    en: 'Persistent Seg is an algorithm in the tree category.',
  },
  tags: ["tree","range-query"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
