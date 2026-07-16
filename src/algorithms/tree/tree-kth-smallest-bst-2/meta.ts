// BST第k小v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-kth-smallest-bst-2',
  categoryId: 'tree',
  title: { zh: 'BST第k小v2', en: 'Kth Smallest in BST v2' },
  summary: {
    zh: '中序遍历找 BST 第 k 小元素。',
    en: 'Inorder traversal to find the kth smallest in a BST.',
  },
  description: { zh: '中序遍历到第 k 个即停。', en: 'Inorder, stop at kth. O(h+k).' },
  tags: ['tree', 'bst', 'kth'],
  complexity: { time: 'O(h+k)', space: 'O(h)' },
};
