// BST Range Query · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bst-range',
  categoryId: 'tree',
  title: { zh: 'BST 区间查询', en: 'BST Range Query' },
  summary: {
    zh: 'BST 区间查询属于tree类别。',
    en: 'BST Range Query is a tree algorithm.',
  },
  description: {
    zh: 'BST 区间查询（BST Range Query）属于tree类别的算法。',
    en: 'BST Range Query is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(h + k)', space: 'O(h)' },
};
