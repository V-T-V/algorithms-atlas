// Preorder Traversal · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binary-tree-preorder',
  categoryId: 'tree',
  title: { zh: '前序遍历', en: 'Preorder Traversal' },
  summary: {
    zh: '前序遍历属于tree类别。',
    en: 'Preorder Traversal is a tree algorithm.',
  },
  description: {
    zh: '前序遍历（Preorder Traversal）属于tree类别的算法。',
    en: 'Preorder Traversal is an algorithm in the tree category.',
  },
  tags: ["tree","sorting"],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
