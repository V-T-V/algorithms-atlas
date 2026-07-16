import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-avl-2',
  categoryId: 'ds',
  title: { zh: 'AVL 树（迭代插入）', en: 'AVL Tree (Iterative Insert)' },
  summary: {
    zh: '迭代方式插入并维护平衡的自平衡二叉搜索树。',
    en: 'Iteratively insert into a self-balancing BST maintaining AVL property.',
  },
  description: {
    zh: 'AVL 树每个节点的左右子树高度差 ≤1。本实现用迭代方法插入并在路径回溯时旋转（LL/RR/LR/RL）。',
    en: 'AVL tree: subtree height difference ≤1. Iterative insert with path-backtracking rotations (LL/RR/LR/RL).',
  },
  tags: ['ds', 'avl', 'bst', 'balanced-tree'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
