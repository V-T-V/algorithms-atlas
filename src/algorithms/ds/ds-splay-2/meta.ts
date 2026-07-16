import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-splay-2',
  categoryId: 'ds',
  title: { zh: 'Splay 树（伸展树）', en: 'Splay Tree' },
  summary: {
    zh: '自调整 BST，每次访问将被访问节点旋转到根。',
    en: 'Self-adjusting BST; rotates the accessed node to the root each time.',
  },
  description: {
    zh: '通过 zig / zig-zig / zig-zag 操作把最近访问节点 splay 到根，热点数据自动上浮。',
    en: 'Uses zig / zig-zig / zig-zag to splay the most recently accessed node to the root; hot data floats up automatically.',
  },
  tags: ['ds', 'splay', 'bst', 'balanced-tree'],
  complexity: { time: 'O(log n) 摊还', space: 'O(n)' },
};
