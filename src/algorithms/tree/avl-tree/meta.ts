// AVL Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'avl-tree',
  categoryId: 'tree',
  title: { zh: 'AVL 平衡二叉树', en: 'AVL Tree' },
  summary: {
    zh: 'AVL 平衡二叉树属于tree类别。',
    en: 'AVL Tree is a tree algorithm.',
  },
  description: {
    zh: 'AVL 平衡二叉树（AVL Tree）属于tree类别的算法。',
    en: 'AVL Tree is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
