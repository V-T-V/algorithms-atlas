// 验证BSTv2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-bst-validate-2',
  categoryId: 'tree',
  title: { zh: '验证BSTv2', en: 'Validate BST v2' },
  summary: {
    zh: '判断一棵二叉树是否是合法 BST（用上下界）。',
    en: 'Validate a BST using min/max bounds.',
  },
  description: {
    zh: '递归传递 (lo, hi)：节点值必须落在区间内。',
    en: 'Pass (lo, hi) bounds down. O(n).',
  },
  tags: ['tree', 'bst', 'validate'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
