// 翻转二叉树v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-invert-2',
  categoryId: 'tree',
  title: { zh: '翻转二叉树v2', en: 'Invert Binary Tree v2' },
  summary: { zh: '交换每个节点的左右子树。', en: 'Swap left and right children of every node.' },
  description: {
    zh: '递归：node.left, node.right = invert(right), invert(left)。',
    en: 'Swap children recursively. O(n).',
  },
  tags: ['tree', 'invert'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
