// Treap (Data Structure) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'treap-ds',
  categoryId: 'ds',
  title: { zh: 'Treap（旋转式数据结构）', en: 'Treap (Rotating)' },
  summary: {
    zh: '旋转式 Treap：BST 按键、堆按随机优先级，插入删除用旋转维护。',
    en: 'A rotation-based Treap: BST by key, heap by random priority, maintained via rotations.',
  },
  description: {
    zh: 'Treap（树堆）是 BST 与堆的结合：每个节点有键 key（满足 BST 序）与随机优先级 priority（满足堆序，父优先级 >= 子）。插入时先按 BST 规则挂入，再用旋转把优先级违背的节点上浮（类似向上冒泡）；删除时先把节点旋转成叶子再摘除。\n\n由于优先级随机，期望树高 O(log n)，各操作期望 O(log n)。与 tree/treap-tree（分裂合并式）不同，本实现采用**旋转式**（插入用左/右旋上浮、删除用旋转下沉），是教科书经典写法，便于理解 Treap 与 AVL/红黑树的关系。空间 O(n)。',
    en: 'A Treap combines a BST and a heap: each node carries a key (satisfying BST order) and a random priority (satisfying heap order, parent priority >= children). Insertion first attaches by BST rules, then uses rotations to bubble up any node violating heap order (like a sift-up); deletion rotates the target down to a leaf, then removes it.\n\nBecause priorities are random, expected height is O(log n) and all operations are expected O(log n). Unlike tree/treap-tree (split/merge style), this implementation is **rotation-based** (insert via sift-up rotations, delete via rotate-down), the textbook form that clarifies the relationship between Treaps and AVL/red-black trees. Space O(n).',
  },
  tags: ['ds', 'treap', 'bst', 'heap', 'rotation', 'randomized'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  attributes: { randomized: 'true', style: 'rotation' },
};
