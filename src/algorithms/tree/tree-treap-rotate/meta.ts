// 树堆旋转 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-treap-rotate',
  categoryId: 'tree',
  title: { zh: '树堆（Treap）旋转', en: 'Treap Rotation' },
  summary: {
    zh: 'Treap = BST（按 key）+ 堆（按随机优先级），插入后用旋转维持堆序。',
    en: 'Treap = BST by key + heap by random priority; rotations maintain heap order after insertion.',
  },
  description: {
    zh: '树堆（Treap）：每个节点同时存储 key（满足 BST 性质）和随机优先级 priority（满足堆性质）。\n- 插入：先按 BST 方式插入新叶子（带随机优先级），再向上旋转：若当前节点的优先级比父节点"更优先"（小顶堆 → priority < parent.priority），做一次旋转提升。\n- 旋转分左旋与右旋，时间 O(1)，整体插入期望 O(log n)。\n- 期望形状等价于随机 BST，因此平衡性来自随机化，无需显式重平衡。',
    en: 'Treap: each node carries a BST key and a random priority satisfying heap order. Insert as a BST leaf with a fresh random priority, then rotate upward while the node outranks its parent (min-heap: priority < parent.priority). Left/right rotations are O(1); expected insertion is O(log n). Expected shape equals a random BST, so balance comes from randomization, no explicit rebalancing.',
  },
  tags: ['tree', 'treap', 'rotation', 'randomized', 'binary-search-tree', 'heap'],
  complexity: { time: '期望 O(log n) 每次', space: 'O(1) 旋转' },
};
