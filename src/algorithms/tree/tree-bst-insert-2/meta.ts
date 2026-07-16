// BST插入v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-bst-insert-2',
  categoryId: 'tree',
  title: { zh: 'BST插入v2', en: 'BST Insert v2' },
  summary: {
    zh: '在 BST 中插入一个值（保持 BST 性质）。',
    en: 'Insert a value into a BST, preserving the BST property.',
  },
  description: {
    zh: '递归：小于当前走左，大于走右，遇空挂节点。',
    en: 'Recurse left/right until a null slot. O(h).',
  },
  tags: ['tree', 'bst', 'insert'],
  complexity: { time: 'O(h)', space: 'O(h)' },
};
