// Inorder Traversal · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binary-tree-inorder',
  categoryId: 'tree',
  title: { zh: '中序遍历', en: 'Inorder Traversal' },
  summary: {
    zh: '中序遍历属于tree类别。',
    en: 'Inorder Traversal is a tree algorithm.',
  },
  description: {
    zh: '中序遍历（Inorder Traversal）属于tree类别的算法。',
    en: 'Inorder Traversal is an algorithm in the tree category.',
  },
  tags: ["tree","sorting"],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
