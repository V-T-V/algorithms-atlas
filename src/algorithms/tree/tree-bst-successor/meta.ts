// BST 后继 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-successor',
  categoryId: 'tree',
  title: { zh: '二叉搜索树后继', en: 'Binary Search Tree Successor' },
  summary: {
    zh: '找 BST 中给定键的大于它的最小元素（中序后继）。',
    en: 'Find the smallest element larger than the given key in a BST (in-order successor).',
  },
  description: {
    zh: 'BST 后继（大于 key 的最小值）：\n1. successor = null\n2. 从根向下：\n   - 若 key < node.value：successor = node（候选），node = node.left\n   - 否则：node = node.right\n3. 返回 successor\n\n原理：沿路径记录最后一个「向左转」的节点。复杂度 O(log n)。',
    en: 'BST successor (smallest value larger than key): successor=null; descend from root; if key<node.value record node as candidate and go left; else go right. Records the last "turn left" node. Complexity O(log n).',
  },
  tags: ['tree', 'bst', 'successor', 'binary-search-tree'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
