// 顺序统计树（带 size 域的 BST）选第 k 小 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'i-th-order-statistic-tree',
  categoryId: 'selection',
  title: { zh: '顺序统计树选第 k 小', en: 'Order Statistic Tree Select' },
  summary: {
    zh: '在带 size 子树大小的 BST 上用 OS-Select 在 O(h) 找第 k 小。',
    en: 'OS-Select on a size-augmented BST finds rank-k in O(h).',
  },
  description: {
    zh: '顺序统计树（Order Statistic Tree）是一棵每个节点额外维护 `size`（子树节点数）的二叉搜索树。在节点 x 处找第 k 小：令 r = size[left[x]] + 1；若 k = r 则 x 即为答案；若 k < r 递归左子树；否则递归右子树找第 k − r 小。\n\n- 插入：沿路径维护 size\n- OS-Select：O(h)，平衡树（如红黑）h=O(log n)；普通 BST 最坏 O(n)\n\n本实现用朴素 BST 插入建树（无自平衡），演示 OS-Select 逻辑。',
    en: 'An order statistic tree is a BST where each node stores `size` (its subtree node count). OS-Select at node x: r = size[left]+1; if k=r return x; if k<r go left; else go right for rank k−r. Insertion updates size along the path. Select is O(h); for a balanced tree O(log n). This demo uses a plain BST (no self-balancing).',
  },
  tags: ['selection', 'bst', 'order-statistics', 'tree'],
  complexity: { time: 'O(log n) 平衡 / O(n) 最坏', space: 'O(n)' },
};
