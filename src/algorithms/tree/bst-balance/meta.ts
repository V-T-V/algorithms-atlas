// Balance BST · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bst-balance',
  categoryId: 'tree',
  title: { zh: '平衡BST', en: 'Balance BST' },
  summary: {
    zh: '平衡BST属于tree类别。',
    en: 'Balance BST is a tree algorithm.',
  },
  description: {
    zh: '平衡BST（Balance BST）属于tree类别的算法。',
    en: 'Balance BST is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
