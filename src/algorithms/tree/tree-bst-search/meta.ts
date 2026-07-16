// BST 查找 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-search',
  categoryId: 'tree',
  title: { zh: '二叉搜索树查找', en: 'Binary Search Tree Search' },
  summary: {
    zh: '在 BST 中查找键：从根比较，小于走左、大于走右。',
    en: 'Search a key in a BST: compare from the root, go left if smaller, right if larger.',
  },
  description: {
    zh: 'BST 查找：\n1. node = root\n2. while node != null:\n   - key == node.value → 找到\n   - key < node.value → node = node.left\n   - key > node.value → node = node.right\n3. node == null → 不存在\n\n利用 BST 性质把每次比较导向一个子树。平均 O(log n)，最坏 O(n)。',
    en: 'BST search: start at root; if key equals node.value found; if smaller go left; if larger go right. Returns null when falling off the tree. Average O(log n), worst O(n).',
  },
  tags: ['tree', 'bst', 'search', 'binary-search-tree'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
