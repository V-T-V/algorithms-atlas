// 最大深度v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-max-depth-2',
  categoryId: 'tree',
  title: { zh: '最大深度v2', en: 'Maximum Depth v2' },
  summary: { zh: '递归求二叉树最大深度。', en: 'Recursive maximum depth of a binary tree.' },
  description: {
    zh: 'depth(node) = 1 + max(depth(left), depth(right))。',
    en: 'depth = 1 + max(left, right). O(n).',
  },
  tags: ['tree', 'depth', 'recursion'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
