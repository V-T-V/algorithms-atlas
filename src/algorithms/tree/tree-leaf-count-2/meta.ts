// 叶子数v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-leaf-count-2',
  categoryId: 'tree',
  title: { zh: '叶子数v2', en: 'Count Leaves v2' },
  summary: { zh: '递归统计二叉树叶子节点数。', en: 'Recursively count leaf nodes.' },
  description: { zh: '无左右子即叶子。', en: 'Leaf if both children null. O(n).' },
  tags: ['tree', 'leaf', 'count'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
