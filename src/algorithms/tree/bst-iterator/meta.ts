// BST Iterator · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bst-iterator',
  categoryId: 'tree',
  title: { zh: 'BST迭代器', en: 'BST Iterator' },
  summary: {
    zh: 'BST迭代器属于tree类别。',
    en: 'BST Iterator is a tree algorithm.',
  },
  description: {
    zh: 'BST迭代器（BST Iterator）属于tree类别的算法。',
    en: 'BST Iterator is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(1) 均摊', space: 'O(h)' },
};
