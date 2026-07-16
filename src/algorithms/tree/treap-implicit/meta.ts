// Implicit Treap · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'treap-implicit',
  categoryId: 'tree',
  title: { zh: '隐式 Treap', en: 'Implicit Treap' },
  summary: {
    zh: '无键 Treap：按下标（位置）而非键值操作，靠子树 size 维持顺序。',
    en: 'A keyless Treap indexed by position: subtree sizes maintain the in-order sequence.',
  },
  description: {
    zh: '隐式 Treap（Implicit Treap / Implicit Cartesian Tree）是不带键的 Treap。每个节点的中序位置即它在序列中的下标——通过维护子树大小 size，可在 O(log n) 内完成任意区间的「插入、删除、区间反转、区间分裂、区间合并」。\n\n核心操作是 split 与 merge：\n- split(t, k)：把树 t 按前 k 个节点分成左右两棵（按 size 而非 key 划分）。\n- merge(l, r)：把两棵树合并，按随机优先级（大顶堆）决定谁作根。\n\n插入 = split 出位置再两次 merge；删除 = 两次 split 取出目标再 merge 两端。区间反转用懒标记（翻转 children）。所有操作 O(log n) 期望，空间 O(n)。适合实现可变序列、区间数据结构。',
    en: "The Implicit Treap (a.k.a. implicit Cartesian tree) is a Treap without keys. Each node's in-order position equals its index in the represented sequence — by maintaining subtree size, it supports O(log n) insert, delete, range-reverse, range-split and range-merge over arbitrary intervals.\n\nCore operations are split and merge:\n- split(t, k): partition tree t into its first k nodes and the rest (by size, not key).\n- merge(l, r): combine two trees; the random priority (max-heap) decides the root.\n\nInsert = split at position then two merges; delete = two splits to extract the target then merge the ends. Range reverse uses a lazy flag (swap children). All operations O(log n) expected, space O(n). Ideal for mutable sequences and range data structures.",
  },
  tags: ['tree', 'treap', 'implicit', 'sequence', 'split-merge', 'order-statistics'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
  attributes: { 'indexed-by': 'position', randomized: 'true' },
};
