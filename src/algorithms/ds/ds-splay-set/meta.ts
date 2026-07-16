// 伸展树集合（Splay Tree）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-splay-set',
  categoryId: 'ds',
  title: { zh: '伸展树集合（Splay Tree）', en: 'Splay Tree Set' },
  summary: {
    zh: '自适应 BST：每次访问把节点旋转到根，摊还 O(log n)。',
    en: 'Self-adjusting BST: each access splays the node to the root; amortized O(log n).',
  },
  description: {
    zh: '伸展树（Splay）是一种自适应平衡二叉搜索树：每次查找/插入/删除后，把相关节点通过 zig/zig-zig/zig-zag 旋转「伸展」到根，使频繁访问的键更靠近根部。无需维护平衡因子，所有操作摊还 O(log n)。本实现为整数值有序集合，支持 insert、delete、search。区别于已有的 splay-ds（侧重不同接口）。零 DOM 依赖。',
    en: 'A splay tree is a self-adjusting BST: after each access/insert/delete, the involved node is splayed to the root via zig/zig-zig/zig-zag rotations, keeping frequently accessed keys near the root. No balance factors; amortized O(log n). Integer ordered set with insert, delete, search. Distinct from the existing splay-ds. Zero DOM dependency.',
  },
  tags: ['ds', 'splay-tree', 'bst', 'self-adjusting'],
  complexity: { time: 'O(log n) amortized', space: 'O(n)' },
};
