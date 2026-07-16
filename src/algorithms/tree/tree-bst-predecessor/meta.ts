// BST 前驱 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-predecessor',
  categoryId: 'tree',
  title: { zh: '二叉搜索树前驱', en: 'Binary Search Tree Predecessor' },
  summary: {
    zh: '找 BST 中给定键的小于它的最大元素（中序前驱）。',
    en: 'Find the largest element smaller than the given key in a BST (in-order predecessor).',
  },
  description: {
    zh: 'BST 前驱（小于 key 的最大值）：\n1. predecessor = null\n2. 从根向下：\n   - 若 key > node.value：predecessor = node（当前是候选），node = node.right\n   - 否则（key <= node.value）：node = node.left\n3. 返回 predecessor\n\n原理：沿路径记录最后一个「向右转」的节点（它小于 key 且最大）。复杂度 O(log n)。',
    en: 'BST predecessor (largest value smaller than key): predecessor=null; descend from root; if key>node.value record node as candidate and go right; else go left. Records the last "turn right" node (which is smaller than key and maximal). Complexity O(log n).',
  },
  tags: ['tree', 'bst', 'predecessor', 'binary-search-tree'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
