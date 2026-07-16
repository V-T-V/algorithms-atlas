// Postorder Traversal · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binary-tree-postorder',
  categoryId: 'tree',
  title: { zh: '后序遍历', en: 'Postorder Traversal' },
  summary: {
    zh: '后序遍历属于tree类别。',
    en: 'Postorder Traversal is a tree algorithm.',
  },
  description: {
    zh: '后序遍历（Postorder Traversal）属于tree类别的算法。',
    en: 'Postorder Traversal is an algorithm in the tree category.',
  },
  tags: ["tree","sorting"],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
