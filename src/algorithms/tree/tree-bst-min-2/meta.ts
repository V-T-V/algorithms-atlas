// BST最小值v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-bst-min-2',
  categoryId: 'tree',
  title: { zh: 'BST最小值v2', en: 'BST Minimum v2' },
  summary: { zh: 'BST 中最小值即最左节点。', en: 'The minimum is the leftmost node of a BST.' },
  description: { zh: '一路向左直到 left 为 null。', en: 'Descend left until null. O(h).' },
  tags: ['tree', 'bst', 'min'],
  complexity: { time: 'O(h)', space: 'O(1)' },
};
