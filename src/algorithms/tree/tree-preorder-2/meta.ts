// 前序遍历v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-preorder-2',
  categoryId: 'tree',
  title: { zh: '前序遍历v2', en: 'Preorder Traversal v2' },
  summary: { zh: '递归前序遍历二叉树：根→左→右。', en: 'Recursive preorder: root, left, right.' },
  description: {
    zh: '访问根，再递归左子树，再递归右子树。',
    en: 'Visit root, recurse left, recurse right. O(n).',
  },
  tags: ['tree', 'traversal', 'preorder'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
