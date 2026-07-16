// 递归求树高 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'recursive-tree-height',
  categoryId: 'recursion',
  title: { zh: '递归求树高', en: 'Recursive Tree Height' },
  summary: {
    zh: '空树高 0；否则 1 + max(左子高, 右子高)。',
    en: 'Empty tree height 0; otherwise 1 + max(left, right subtree heights).',
  },
  description: {
    zh: '递归计算二叉树高度（深度）：\n- 基线：节点为 null → 返回 0\n- 递归：1 + max(height(left), height(right))\n\n每个节点访问一次，时间 O(n)，空间 O(h)（h 为树高，递归栈）。',
    en: 'Recursively compute binary-tree height: null returns 0; otherwise 1 + max(height(left), height(right)). Visits each node once: O(n) time, O(h) space for the recursion stack.',
  },
  tags: ['recursion', 'tree', 'height', 'binary-tree'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
