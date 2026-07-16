// Treap（随机化平衡 BST 集合）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-treap-set',
  categoryId: 'ds',
  title: { zh: 'Treap（随机化平衡 BST 集合）', en: 'Treap (Randomized Balanced BST Set)' },
  summary: {
    zh: '按 key 排 BST + 按 priority 排堆，旋转维持平衡，期望 O(log n)。',
    en: 'BST by key + heap by random priority; rotations keep balance; expected O(log n).',
  },
  description: {
    zh: 'Treap 每个节点有两个属性：键值 key（满足 BST 性质）与随机优先级 priority（满足堆性质）。插入时随机生成 priority，若违反堆性质则通过旋转恢复。删除通过把节点旋转到叶子再摘除。期望树高 O(log n)。本实现为整数值有序集合，支持 insert、delete、search、inorder。区别于已有的 treap/treap-ds（侧重不同接口或可重复键）。零 DOM 依赖。',
    en: 'Each Treap node carries a key (BST property) and a random priority (heap property). On insert, a random priority is drawn; if it violates the heap, rotations restore it. Deletion rotates the target to a leaf then detaches. Expected height O(log n). Integer ordered set with insert, delete, search, inorder. Distinct from existing treap/treap-ds. Zero DOM dependency.',
  },
  tags: ['ds', 'treap', 'bst', 'randomized', 'balanced-tree'],
  complexity: { time: 'O(log n) expected', space: 'O(n)' },
};
