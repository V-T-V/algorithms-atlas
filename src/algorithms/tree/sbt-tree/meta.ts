// Size Balanced Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sbt-tree',
  categoryId: 'tree',
  title: { zh: '尺寸平衡树', en: 'Size Balanced Tree' },
  summary: {
    zh: '用子树大小作为平衡判据，旋转维持 size 平衡性质。',
    en: 'Uses subtree sizes as the balance criterion, rotating to maintain the size-balance invariant.',
  },
  description: {
    zh: '尺寸平衡树（Size Balanced Tree, SBT）由陈启峰提出，是一种自平衡二叉搜索树。每个节点维护以其为根的子树大小 size，并满足：对任意节点 t，size(t.left) >= size(t.right.left) 且 size(t.left) >= size(t.right.right)（对右子树对称）。即每棵子树都不小于其兄弟子树的任一子树的大小。\n\n该性质保证了树高 O(log n)。通过左旋 / 右旋在插入、删除后维护不变式（maintain 操作递归修复）。查找、插入、删除均为 O(log n)，且能天然支持「按排名查询第 k 小」「以 size 为权值的子树统计」等顺序统计操作。空间 O(n)。',
    en: 'The Size Balanced Tree (SBT), proposed by Qifeng Chen, is a self-balancing BST. Each node stores the size of its subtree, and the tree maintains: for every node t, size(t.left) >= size(t.right.left) and size(t.left) >= size(t.right.right) (symmetric for the right child) — i.e. each subtree is no smaller than any subtree of its sibling.\n\nThis invariant keeps height O(log n). Left/right rotations restore it after insert and delete (a recursive "maintain" step). Search, insert and delete are all O(log n), and the size field natively supports order-statistics queries like "k-th smallest". Space O(n).',
  },
  tags: ['tree', 'bst', 'self-balancing', 'size-balanced', 'rotation'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  attributes: { balance: 'size-based', 'order-statistics': 'true' },
};
