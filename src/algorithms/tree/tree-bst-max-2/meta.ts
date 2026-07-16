// BST最大值v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-bst-max-2',
  categoryId: 'tree',
  title: { zh: 'BST最大值v2', en: 'BST Maximum v2' },
  summary: { zh: 'BST 中最大值即最右节点。', en: 'The maximum is the rightmost node of a BST.' },
  description: { zh: '一路向右直到 right 为 null。', en: 'Descend right until null. O(h).' },
  tags: ['tree', 'bst', 'max'],
  complexity: { time: 'O(h)', space: 'O(1)' },
};
