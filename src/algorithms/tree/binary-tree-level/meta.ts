// Level Order · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binary-tree-level',
  categoryId: 'tree',
  title: { zh: '层序遍历', en: 'Level Order' },
  summary: {
    zh: '层序遍历属于tree类别。',
    en: 'Level Order is a tree algorithm.',
  },
  description: {
    zh: '层序遍历（Level Order）属于tree类别的算法。',
    en: 'Level Order is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(n)', space: 'O(w)' },
};
