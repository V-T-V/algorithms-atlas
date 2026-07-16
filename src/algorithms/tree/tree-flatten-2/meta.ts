// 展开为链表v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-flatten-2',
  categoryId: 'tree',
  title: { zh: '展开为链表v2', en: 'Flatten to Linked List v2' },
  summary: {
    zh: '把二叉树按前序展开成只有右孩子的链表。',
    en: 'Flatten a tree into a right-skewed list (preorder).',
  },
  description: {
    zh: '递归：展开左子、展开右子，把左子插到当前与右子之间。',
    en: 'Flatten left/right then splice. O(n).',
  },
  tags: ['tree', 'flatten'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
