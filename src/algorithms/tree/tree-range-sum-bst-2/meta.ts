// BST区间和v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-range-sum-bst-2',
  categoryId: 'tree',
  title: { zh: 'BST区间和v2', en: 'Range Sum of BST v2' },
  summary: {
    zh: '求 BST 中值在 [lo, hi] 范围内的节点之和。',
    en: 'Sum of BST nodes with values in [lo, hi].',
  },
  description: {
    zh: '利用 BST 性质剪枝递归。',
    en: 'Prune using BST property. O(n) worst, O(h+k) typical.',
  },
  tags: ['tree', 'bst', 'range-sum'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
