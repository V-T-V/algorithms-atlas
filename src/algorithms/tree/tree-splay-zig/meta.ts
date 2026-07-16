// 伸展树 Zig · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-splay-zig',
  categoryId: 'tree',
  title: { zh: '伸展树 Zig/Zig-zag/Zig-zig', en: 'Splay Tree Zig/Zig-zag/Zig-zig' },
  summary: {
    zh: '伸展树访问后将被访问节点旋转到根：Zig、Zig-zig、Zig-zag 三种情况。',
    en: 'After accessing a node, a splay tree rotates it to the root via Zig, Zig-zig, or Zig-zag.',
  },
  description: {
    zh: '伸展树：每次访问 key x 后用一系列旋转把它移到根。\n- Zig：x 的父节点是根 → 单次旋转（左旋或右旋）。\n- Zig-zig：x 和父节点都是各自父的同一侧儿子 → 先旋转父节点的父（祖父），再旋转 x 的父。\n- Zig-zag：x 和父节点方向相反（一左一右）→ 先旋转 x 的父（变成 zig 配置），再旋转新的父。\n\n伸展树不维护显式平衡信息，但均摊每操作 O(log n)。常用于实现高效的自适应数据结构。',
    en: 'Splay tree: after accessing key x, rotate it up to the root via: Zig (parent is root, single rotation); Zig-zig (x and parent are same-side children, rotate grandparent first then parent); Zig-zag (x and parent are opposite-side, rotate parent twice). No explicit balance info, but amortized O(log n) per operation.',
  },
  tags: ['tree', 'splay-tree', 'rotation', 'self-balancing', 'amortized'],
  complexity: { time: '均摊 O(log n)', space: 'O(1) 旋转' },
};
