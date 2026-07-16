// Splay Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'splay-tree',
  categoryId: 'tree',
  title: { zh: '伸展树', en: 'Splay Tree' },
  summary: {
    zh: '伸展树属于tree类别。',
    en: 'Splay Tree is a tree algorithm.',
  },
  description: {
    zh: '伸展树（Splay Tree）属于tree类别的算法。',
    en: 'Splay Tree is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
