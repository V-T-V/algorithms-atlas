// Scapegoat Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'scapegoat-tree-impl',
  categoryId: 'tree',
  title: { zh: '替罪羊树', en: 'Scapegoat Tree' },
  summary: {
    zh: '不存平衡信息的自平衡 BST：失衡时找到「替罪羊」子树整体重建。',
    en: 'A self-balancing BST storing no balance info: on imbalance, rebuild the offending "scapegoat" subtree.',
  },
  description: {
    zh: '替罪羊树（Scapegoat Tree）是一种自平衡二叉搜索树，节点不存储高度、颜色等额外信息，仅维护整棵树的节点数 n 和 maxN（自上次完全重建以来的最大节点数）。设松弛参数 α∈(0.5, 1)，当某节点 node 的某个子节点 size > α·node.size 时，该 node 即为「替罪羊」——把它为根的整棵子树按中序重建成完美平衡的 BST。\n\n插入 O(log n) 均摊，查找 O(log n)，删除通过「惰性收缩」（n 减小，maxN 不变；当 n < α·maxN 时整树重建）。空间 O(n)。优势是实现简单、无旋转。',
    en: 'A Scapegoat Tree is a self-balancing BST that stores no per-node balance info (no height, no color), only the tree size n and maxN (largest size since the last full rebuild). Given a slack factor α∈(0.5, 1), when a node has a child whose size exceeds α·node.size, that node is the "scapegoat" — its entire subtree is rebuilt from its in-order traversal into a perfectly balanced BST.\n\nInsert is O(log n) amortised, search O(log n); deletion uses "lazy shrinking" (n drops, maxN stays; when n < α·maxN the whole tree is rebuilt). Space O(n). Advantages: simple, rotation-free.',
  },
  tags: ['tree', 'bst', 'self-balancing', 'scapegoat', 'rebuild'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  attributes: { balance: 'alpha-rebuild', amortized: 'O(log n)' },
};
