// BST删除v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-bst-delete-2',
  categoryId: 'tree',
  title: { zh: 'BST删除v2', en: 'BST Delete v2' },
  summary: {
    zh: '从 BST 删除指定值节点，保持 BST 性质。',
    en: 'Delete a value from a BST, preserving the property.',
  },
  description: {
    zh: '三种情况：无子直接删、单子顶替、双子用中序后继替换。',
    en: 'Three cases; two-child uses successor. O(h).',
  },
  tags: ['tree', 'bst', 'delete'],
  complexity: { time: 'O(h)', space: 'O(h)' },
};
