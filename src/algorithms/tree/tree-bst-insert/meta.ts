// BST 插入 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-insert',
  categoryId: 'tree',
  title: { zh: '二叉搜索树插入', en: 'Binary Search Tree Insert' },
  summary: {
    zh: '向 BST 插入一个键：从根开始比较，小于走左、大于走右，找到空位挂上。',
    en: 'Insert a key into a BST: compare from the root, go left if smaller, right if larger, and attach at the first empty slot.',
  },
  description: {
    zh: 'BST 插入：\n1. 若树空，新节点为根\n2. 从根 node 开始：\n   - 若 key < node.value：若有左子则下钻左子，否则挂为左子\n   - 若 key > node.value：若有右子则下钻右子，否则挂为右子\n   - 通常相等时不插入（或更新）\n\n保持 BST 性质（左 < 根 < 右）。平均 O(log n)，最坏 O(n)（链化）。',
    en: 'BST insert: if tree empty, new node is root; otherwise compare from root — if key<node.value descend/attach left; if key>node.value descend/attach right; equal keys typically skipped. Preserves the BST property (left < root < right). Average O(log n), worst O(n) (degenerate chain).',
  },
  tags: ['tree', 'bst', 'insert', 'binary-search-tree'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
