// AVL 旋转 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-avl-rotation',
  categoryId: 'tree',
  title: { zh: 'AVL 树旋转', en: 'AVL Tree Rotation' },
  summary: {
    zh: 'AVL 自平衡的四种旋转：LL、RR、LR、RL，保持 BST 性质并平衡。',
    en: 'Four AVL rebalancing rotations (LL, RR, LR, RL) that preserve the BST property and restore balance.',
  },
  description: {
    zh: 'AVL 旋转：\n- 右旋（LL 情况）：node 的左子更高，且左子的左子更高。设 y=node, x=y.left, 则旋转后 x 成为新根，y 变为 x 的右子，x 原右子挂到 y.left。\n- 左旋（RR 情况）：对称。\n- LR：先对 node.left 左旋，再对 node 右旋。\n- RL：先对 node.right 右旋，再对 node 左旋。\n\n每个节点维护 height，平衡因子 = h(left) - h(right)，绝对值超过 1 触发旋转。复杂度 O(1) 每次旋转。',
    en: "AVL rotations: right-rotate for LL (left child taller, its left child taller). Let y=node, x=y.left; after rotation x becomes new root, y becomes x.right, x's old right subtree attaches to y.left. Left-rotate for RR (symmetric). LR = left-rotate on node.left then right-rotate on node. RL = right-rotate on node.right then left-rotate on node. Each node stores height; balance factor = h(left)-h(right); rebalance when |bf|>1. O(1) per rotation.",
  },
  tags: ['tree', 'avl', 'rotation', 'self-balancing', 'binary-search-tree'],
  complexity: { time: 'O(1) 每次旋转', space: 'O(1)' },
};
